import { GoogleGenerativeAI, Content, GenerateContentResult } from "@google/generative-ai";
import { DiagnosisRequest, DiagnosisResult } from "@krishi-mitra/types";
import { env } from "../config/env";
import ApiError from "../utils/ApiError";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const API_TIMEOUT_MS = 15000;

function timeout(ms: number) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Request timed out after ${ms} ms`)), ms)
  );
}

export class GeminiService {
  async analyzePlantDisease(request: {
    imageBuffer: Buffer;
    mimeType: string;
    language: DiagnosisRequest["language"];
  }): Promise<DiagnosisResult> {
    try {
      const { imageBuffer, mimeType, language } = request;

      const imagePart = {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType,
        },
      };

      const prompt = this.buildPrompt(language);
      const contents: Content[] = [
        { role: "user", parts: [{ text: prompt }, imagePart] },
      ];

      console.log("📡 Sending request to Gemini API...");

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const resultPromise = model.generateContent({ contents });

      const result = (await Promise.race([
        resultPromise,
        timeout(API_TIMEOUT_MS),
      ])) as GenerateContentResult;

      const text = result.response.text();

      return this.parseResponse(text, language);
    } catch (error: unknown) {
      console.error("❌ Gemini API error:", error);

      if (error instanceof Error) {
        if (/API_KEY_INVALID|not valid/i.test(error.message)) {
          throw new ApiError(
            400,
            "Google API Error: Invalid or expired API Key. Please regenerate it in AI Studio."
          );
        }
        if (/fetch|network/i.test(error.message)) {
          throw new ApiError(
            503,
            "Network error: The backend failed to connect to the Gemini API."
          );
        }
        if (/timed out/i.test(error.message)) {
          throw new ApiError(408, "Request to Gemini API timed out.");
        }
        throw new ApiError(500, `Gemini Service Error: ${error.message}`);
      }

      throw new ApiError(
        500,
        "Failed to analyze plant image due to an unexpected error."
      );
    }
  }

  private buildPrompt(language: string): string {
    const prompts = {
      en: `Analyze this plant image for diseases. Respond ONLY with a valid JSON object following this exact structure: {"disease_name": "Name of the disease or 'Healthy'", "confidence": 0.85, "symptoms": ["Symptom 1", "Symptom 2"], "treatment": "Recommended treatment steps.", "prevention": "Prevention measures."}`,
      hi: `इस पौधे की तस्वीर का विश्लेषण करें। केवल एक वैध JSON ऑब्जेक्ट के साथ उत्तर दें जो इस संरचना का पालन करता है: {"disease_name": "बीमारी का नाम या 'स्वस्थ'", "confidence": 0.85, "symptoms": ["लक्षण 1", "लक्षण 2"], "treatment": "सुझाए गए उपचार के चरण।", "prevention": "बचाव के उपाय।"}`,
    };
    return prompts[language as keyof typeof prompts] || prompts.en;
  }

  private parseResponse(
    text: string,
    language: DiagnosisRequest["language"]
  ): DiagnosisResult {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          disease_name: parsed.disease_name || "Analysis Failed",
          confidence: parsed.confidence || 0,
          symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : [],
          treatment: parsed.treatment || "No treatment information available.",
          prevention: parsed.prevention || "No prevention information available.",
          language,
        };
      }
      throw new Error("No valid JSON found in response.");
    } catch (error) {
      console.error(
        "⚠️ Failed to parse Gemini JSON response:",
        error,
        "Raw text:",
        text
      );
      return {
        disease_name: "Analysis Incomplete",
        confidence: 0,
        symptoms: ["Could not parse the AI response."],
        treatment: "The analysis from the AI was malformed. Please try again.",
        prevention: "Ensure the subject is centered and in focus.",
        language,
      };
    }
  }
}
