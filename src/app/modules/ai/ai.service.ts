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
      model: "llama-3-8b-8192", // Fast and efficient for suggestions
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

export const aiService = {
  getSearchSuggestions
};
