import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

export const handleAiChat = async (req: Request, res: Response) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("AI chat error:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
};

const stripCodeFences = (text: string) => {
  return text
    .replace(/```[\s\S]*?\n/g, "") // opening fence (optionally with language)
    .replace(/```/g, "")
    .trim();
};

export const handleInlineCompletion = async (req: Request, res: Response) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { language, prefix, suffix, maxTokens } = req.body ?? {};

    if (!language || typeof prefix !== "string" || typeof suffix !== "string") {
      return res.status(400).json({
        error: "language, prefix, suffix are required",
      });
    }

    // Keep prompt small and deterministic.
    const prompt = [
      "You are an inline code completion engine (Copilot-like).",
      "Return ONLY the code continuation to insert at the cursor.",
      "Rules:",
      "- No markdown, no backticks, no explanations.",
      "- Do not repeat the prefix.",
      "- Prefer a short, high-confidence continuation.",
      "- Keep indentation consistent with the prefix.",
      "",
      `Language: ${language}`,
      "",
      "PREFIX (text before cursor):",
      prefix,
      "",
      "SUFFIX (text after cursor):",
      suffix,
      "",
      "COMPLETION (insert at cursor):",
    ].join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      // Best-effort: the SDK may ignore unknown fields, but it's safe.
      // @ts-expect-error - optional generation config
      generationConfig: {
        maxOutputTokens: typeof maxTokens === "number" ? maxTokens : 128,
        temperature: 0.2,
      },
    });

    const completionRaw = response.text ?? "";
    const completion = stripCodeFences(completionRaw);

    res.json({ completion });
  } catch (error) {
    const anyErr = error as any;
    const status = typeof anyErr?.status === "number" ? anyErr.status : 500;

    // Surface quota/rate-limit properly so frontend can back off.
    if (status === 429) {
      console.error("AI inline completion rate-limited:", anyErr);
      return res.status(429).json({
        error: "AI rate limit exceeded. Please wait a bit and try again.",
      });
    }

    console.error("AI inline completion error:", error);
    res.status(500).json({ error: "Failed to generate inline completion" });
  }
};
