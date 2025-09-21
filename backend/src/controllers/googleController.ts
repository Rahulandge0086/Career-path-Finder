import type { Request, Response } from "express";
import { generateContent } from "../services/geminiServices.js";

export const generateContentHandler = async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const content = await generateContent(prompt);
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate content" });
  }
};
