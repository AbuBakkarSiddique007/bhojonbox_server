import { Request, Response } from "express";
import { aiService } from "./ai.service.js";
import httpStatus from "http-status";

const getSuggestions = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const suggestions = await aiService.getSearchSuggestions(q as string);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Suggestions retrieved successfully",
      data: suggestions,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const chat = async (req: Request, res: Response) => {
  try {
    const { messages, userContext } = req.body;
    const reply = await aiService.getChatResponse(messages, userContext);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Chat response retrieved successfully",
      data: reply,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const aiController = {
  getSuggestions,
  chat,
};
