import { GoogleGenerativeAI, Content, GenerateContentResult } from "@google/generative-ai";
import { DiagnosisRequest, DiagnosisResult, EstimatedInputsResponse } from "@krishi-mitra/types";
import { env } from "../config/env";
import ApiError from "../utils/ApiError";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const API_TIMEOUT_MS = 20000; // Increased timeout for more complex prompt

function timeout(ms: number) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Request timed out after ${ms} ms`)), ms)
  );
}

export class GeminiService {
  async analyzePlantDisease(request: {
    imageBuffer: Buffer;
    mimeType: string;
  }): Promise<DiagnosisResult> {
    const { imageBuffer, mimeType } = request;
    
    try {
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType,
        },
      };

      const prompt = this.buildDiseasePrompt();
      const contents: Content[] = [
        { role: "user", parts: [{ text: prompt }, imagePart] },
      ];

      console.log(`📡 Sending ENHANCED analysis request to Gemini...`);

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
      const resultPromise = model.generateContent({ contents });

      const result = (await Promise.race([
        resultPromise,
        timeout(API_TIMEOUT_MS),
      ])) as GenerateContentResult;

      console.log("✅ Successfully received ENHANCED response from Gemini.");

      const text = result.response.text();
      return this.parseDiseaseResponse(text);

    } catch (error: unknown) {
      if (error instanceof Error) {
        if (/timed out/i.test(error.message)) {
          console.error("❌ Gemini API Error: Request timed out.");
          throw new ApiError(408, "Request to Gemini API timed out.");
        }
        if (/API_KEY_INVALID|not valid/i.test(error.message)) {
          console.error("❌ Gemini API Error: Invalid API Key.");
          throw new ApiError(
            400,
            "Google API Error: Invalid or expired API Key. Please regenerate it in AI Studio."
          );
        }
        if (/fetch|network/i.test(error.message)) {
          console.error("❌ Gemini API Error: Network connection issue.");
          throw new ApiError(
            503,
            "Network error: The backend failed to connect to the Gemini API."
          );
        }
        console.error("❌ Gemini Service Error:", error.message);
        throw new ApiError(500, `Gemini Service Error: ${error.message}`);
      }

      console.error("❌ Gemini Service Error: An unexpected error occurred.", error);
      throw new ApiError(500, "Failed to analyze plant image due to an unexpected error.");
    }
  }

  private buildDiseasePrompt(): string {
    return `
      You are an expert AI agriculturalist. Analyze the provided plant image.
      
      Your response MUST BE A SINGLE, VALID JSON OBJECT AND NOTHING ELSE. Do not include markdown formatting.
      
      The JSON object must have the following top-level keys:
      - "is_healthy": A boolean (true or false).
      - "confidence": A number between 0.0 and 1.0 representing your confidence in the diagnosis.
      - "en": An object containing the analysis in English.
      - "hi": An object containing the exact same analysis, but translated into Hindi.
      
      **RULES:**
      
      1.  **If the plant is HEALTHY:**
          - Set "is_healthy" to true.
          - In both "en" and "hi" objects, set:
            - "disease_name" to "Healthy Plant" (and its Hindi translation).
            - "symptoms", "treatment", "prevention" to empty arrays or strings.
            - "advice": Provide 2-3 short, helpful, general advice points for keeping the plant healthy (e.g., watering tips, sunlight, soil health). This MUST be in both English and Hindi.
      
      2.  **If the plant has a DISEASE:**
          - Set "is_healthy" to false.
          - In both "en" and "hi" objects, you MUST provide detailed information for the following keys:
            - "disease_name": The common name of the disease.
            - "symptoms": A string array of key symptoms visible or expected.
            - "treatment": A string with actionable steps for treatment. Focus on organic or commonly available solutions first.
            - "prevention": A string with actionable steps for prevention.
      
      **Example JSON structure for a diseased plant:**
      {
        "is_healthy": false,
        "confidence": 0.92,
        "en": {
          "disease_name": "Tomato Late Blight",
          "symptoms": ["Dark, water-soaked spots on leaves", "White mold on the underside of spots", "Lesions on stems"],
          "treatment": "Remove and destroy infected leaves immediately. Apply a copper-based fungicide, ensuring full coverage of the plant. Improve air circulation around plants.",
          "prevention": "Ensure proper spacing between plants. Water at the base of the plant to keep leaves dry. Rotate crops and avoid planting in the same spot for 2-3 years."
        },
        "hi": {
          "disease_name": "टमाटर का पछेती झुलसा",
          "symptoms": ["पत्तियों पर गहरे, पानी से लथपथ धब्बे", "धब्बों के नीचे की तरफ सफेद फफूंद", "तनों पर घाव"],
          "treatment": "संक्रमित पत्तियों को तुरंत हटा दें और नष्ट कर दें। तांबे पर आधारित फफूंदनाशक का प्रयोग करें, यह सुनिश्चित करते हुए कि पौधे की पूरी कवरेज हो। पौधों के आसपास हवा का संचार सुधारें।",
          "prevention": "पौधों के बीच उचित दूरी सुनिश्चित करें। पत्तियों को सूखा रखने के लिए पौधे के आधार पर पानी दें। फसल चक्र अपनाएं और 2-3 साल तक एक ही स्थान पर रोपण से बचें।"
        }
      }
    `;
  }

  private parseDiseaseResponse(text: string): DiagnosisResult {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        // This is now the complete, bilingual result from Gemini
        return JSON.parse(jsonMatch[0]) as DiagnosisResult;
      }
      throw new Error("No valid JSON found in the enhanced response.");
    } catch (error) {
      console.error("⚠️ Failed to parse Gemini JSON response:", error, "Raw text:", text);
      throw new ApiError(500, "The analysis from the AI was malformed. Please try again.");
    }
  }

  // ... (keep the estimateInputsFromImages and buildEstimationPrompt methods from the previous step)
  async estimateInputsFromImages(images: { buffer: Buffer; mimeType: string }[], location: string): Promise<EstimatedInputsResponse> {
    try {
      const imageParts = images.map(image => ({
        inlineData: {
          data: image.buffer.toString("base64"),
          mimeType: image.mimeType,
        },
      }));
      
      const prompt = this.buildEstimationPrompt(location);
      const contents: Content[] = [
        { role: "user", parts: [{ text: prompt }, ...imageParts] },
      ];
      
      console.log(`📡 Sending input estimation request to Gemini for location: ${location}...`);
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const resultPromise = model.generateContent({ contents });

      const result = (await Promise.race([
        resultPromise,
        timeout(API_TIMEOUT_MS * 2),
      ])) as GenerateContentResult;

      console.log("✅ Successfully received estimation response from Gemini.");
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as EstimatedInputsResponse;
      }
      
      throw new Error("No valid JSON found in Gemini's estimation response.");

    } catch (error) {
      console.error("❌ Gemini input estimation error:", error);
      if (error instanceof Error) {
        throw new ApiError(500, `Gemini Estimation Error: ${error.message}`);
      }
      throw new ApiError(500, "Failed to estimate inputs due to an unexpected error.");
    }
  }

  private buildEstimationPrompt(location: string): string {
    return `
      Analyze the following images of a crop field and its environment, located at "${location}".
      Your task is to estimate the values for a crop yield prediction model based on visual evidence and general agricultural knowledge for the given region.
      Respond ONLY with a valid JSON object. Do not include any other text or markdown formatting.
      The JSON object should have some or all of the following keys. If a value cannot be reasonably estimated, omit the key.
      - "Rainfall_mm": Annual rainfall in millimeters. Estimate based on the location.
      - "Temperature_Celsius": Average growing season temperature in Celsius. Estimate based on location and visual cues (e.g., season).
      - "Days_to_Harvest": Estimated number of days until the crop is ready for harvest. Analyze the maturity of the plants in the images.
      - "Temperature_Stress_Index": A score from 0.0 to 1.0 indicating heat or cold stress. 1.0 is optimal. Look for signs of wilting, discoloration, or frost damage.
      - "Agricultural_Input_Score": A score from 0.0 to 1.0 indicating the level of resources (fertilizer, irrigation). Look for signs of lush, uniform growth (high score) versus patchy, yellowing plants (low score).
      Do NOT estimate "Rainfall_Intensity", "Temp_Rainfall_Interaction", or "Growing_Degree_Days" as these are hard to determine from images.
      Example Response:
      {
        "Rainfall_mm": 950,
        "Temperature_Celsius": 28.5,
        "Days_to_Harvest": 110,
        "Temperature_Stress_Index": 0.9,
        "Agricultural_Input_Score": 0.7
      }
    `;
  }
}