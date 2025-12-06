import { Request, Response } from "express";

interface ParsedTask {
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string | null;
  original_transcript: string;
}

import fs from "fs";
import path from "path";
import OpenAI from "openai";

class AIController {
  constructor() {
    this.transcribe = this.transcribe.bind(this);
  }

  private _parseWithRegex(text: string): ParsedTask {
    let title = text;
    let priority = "Medium";
    let status = "To Do";
    let dueDate: string | null = null;

    const lowerText = text.toLowerCase();

    if (
      lowerText.includes("urgent") ||
      lowerText.includes("high priority") ||
      lowerText.includes("critical")
    ) {
      priority = "High";
    } else if (lowerText.includes("low priority")) {
      priority = "Low";
    }

    const today = new Date();
    if (lowerText.includes("tomorrow")) {
      const d = new Date(today);
      d.setDate(d.getDate() + 1);
      dueDate = d.toISOString().split("T")[0];
    } else if (lowerText.includes("today")) {
      dueDate = today.toISOString().split("T")[0];
    }

    return {
      title: title,
      description: "",
      status,
      priority,
      due_date: dueDate,
      original_transcript: text,
    };
  }

  async transcribe(req: Request, res: Response): Promise<any> {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    const tempPath = req.file.path;
    const targetPath =
      tempPath + path.extname(req.file.originalname || "file.webm");

    try {
      fs.renameSync(tempPath, targetPath);

      const apiKey = process.env.OPENAI_API_KEY;
      let transcript = "";

      if (apiKey) {
        const openai = new OpenAI({ apiKey });
        const response = await openai.audio.transcriptions.create({
          file: fs.createReadStream(targetPath),
          model: "whisper-1",
        });
        transcript = response.text;
      } else {
        console.warn("No OPENAI_API_KEY found. using mock transcript.");
        transcript = "Schedule a meeting with John tomorrow at 10 AM";
      }

      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
      }

      const structure = this._parseWithRegex(transcript);
      res.json({ data: structure });
    } catch (error: any) {
      console.error("Transcription error:", error);
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
      } else if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      res.status(500).json({ error: "Failed to process audio" });
    }
  }
}

export default new AIController();
