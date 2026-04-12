import Groq from "groq-sdk";
import { prisma } from "../../lib/prisma.js";
import { envVars } from "../../config/env.js";
import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError.js";

const groq = new Groq({ apiKey: envVars.GROQ_API_KEY });

const getSearchSuggestions = async (q: string) => {
  if (!q || q.length < 1) return [];

  // 1. Fetch grounding data (existing meals and categories):
  const [meals, categories] = await Promise.all([
    prisma.meal.findMany({
      where: { isAvailable: true },
      select: { name: true },
      take: 50 // Limit to avoid hitting context limits, though 50 is fine
    }),
    prisma.category.findMany({
      select: { name: true }
    })
  ]);

  const mealNames = meals.map(m => m.name);
  const categoryNames = categories.map(c => c.name);

  // 2. Call Groq for intelligent suggestions:
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a culinary search assistant for "BhojonBox".
          Grounding Data:
          Meals: ${mealNames.join(", ")}
          Categories: ${categoryNames.join(", ")}

          Task: Generate 5-8 search suggestions for a user typing: "${q}"
          Rules:
          1. Prioritize EXACT or PARTIAL matches from the Grounding Data (Meals and Categories).
          2. If there are few matches, suggest related food items or cuisines that would fit a premium food delivery app.
          3. Return ONLY a JSON array of strings. 
          4. Keep suggestions short (1-4 words).
          5. No explanations or extra text. Output format: ["Suggestion 1", "Suggestion 2"]`
        },
        {
          role: "user",
          content: q
        }
      ],
      model: "llama-3.1-8b-instant", // High-performance Llama 3.1
      temperature: 0.2, // Low temperature for consistent suggestions
      max_tokens: 150,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    // Handle different possible JSON shapes from LLM:
    const suggestions = Array.isArray(parsed) ? parsed : Object.values(parsed).find(v => Array.isArray(v)) || [];
    
    return suggestions as string[];
  } catch (error: any) {
    console.error("Groq AI Error:", error);
    // Fallback to simple database fuzzy match if AI fails or rate limited:
    const fallback = mealNames
      .filter(name => name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 5);
    return fallback;
  }
};

const getChatResponse = async (messages: string[], userContext?: { name: string, role: string } | null) => {
  // 1. Construct conversational history for Groq
  const history = messages.map((m, i) => ({
    role: i % 2 === 0 ? "user" : "assistant",
    content: m
  }));

  const userIdentity = userContext?.name 
    ? `The patron you are speaking with is "${userContext.name}" (Role: ${userContext.role}). Address them respectfully.`
    : `The patron is currently a Guest (not logged in). Proactively suggest registration if they want to buy or sell.`;

  try {
    // Late-binding check for API key to ensure Render environment sync
    const apiKey = envVars.GROQ_API_KEY || process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("AI Service Error: GROQ_API_KEY is missing from environment variables.");
      return "I am currently initializing my culinary knowledge. Please try again in a few moments.";
    }

    const groqInstance = new Groq({ apiKey });
    
    const chatCompletion = await groqInstance.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are the "BhojonBox Concierge", a premium, sophisticated AI guide for the BhojonBox food delivery platform. 

          Context: ${userIdentity}

          Core Guidelines:
          - Brand Tone: Obsidian & Gold, Executive, Culinary, Cultivated.
          - Role: Help users navigate the site and answer "How-to" questions.
          
          Website Knowledge Base:
          1. **Authentication**: Users can login at "/login" or register at "/register". 
          2. **Roles**: We have "customers" (who buy) and "providers" (who sell).
          3. **How to Register**: Click the Register button in the header. Choose your role during signup.
          4. **How to Post a Meal**: Only "providers" can do this. Log in as a Provider, go to "Provider Dashboard" -> "Menu", and click "Add Meal".
          5. **How to Buy**: Browse "/meals", add to cart, and follow the checkout process. We support Stripe Online Payment and Cash on Delivery.
          6. **Orders**: Customers track orders at "/customer-dashboard/orders". Providers manage incoming orders at "/provider-dashboard/orders".
          
          Conversation Rules:
          - Be polite and helpful.
          - CRITICAL: When suggesting a page, specify the EXACT route starting with '/' (e.g., "Visit /meals to explore"). These will be automatically converted to clickable links for the user.
          - If asked about something outside of food or BhojonBox, gracefully redirect: "As your culinary concierge, I specialize in navigating the BhojonBox collections. Perhaps you'd like to explore our latest meals?"
          - Keep responses concise but "high-end".`
        },
        ...(history as any)
      ],
      model: "llama-3.3-70b-versatile", 
      temperature: 0.7,
      max_tokens: 500
    });

    return chatCompletion.choices[0]?.message?.content || "My apologies, I am momentarily indisposed. How else may I assist you?";
  } catch (error: any) {
    console.error("Groq Chat Error:", error?.response?.data || error?.message || error);
    return "I am currently attending to multiple culinary engagements. Please allow me a moment and try again.";
  }
};

export const aiService = {
  getSearchSuggestions,
  getChatResponse
};
