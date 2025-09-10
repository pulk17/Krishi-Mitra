import { GoogleGenerativeAI, Content, GenerateContentResult } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

// --- START DEBUGGING ---
const envPath = path.resolve(__dirname, "../../.env");
console.log(`[DEBUG] test-gemini: Searching for .env file at: ${envPath}`);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("[DEBUG] test-gemini: !!! DOTENV FAILED TO LOAD FILE !!!", result.error);
} else {
  console.log("[DEBUG] test-gemini: Dotenv loaded successfully.");
}

const apiKey = process.env.GEMINI_API_KEY;
console.log(`[DEBUG] test-gemini: Value of API Key before use is: ${apiKey}`);
// --- END DEBUGGING ---

if (!apiKey) {
  throw new Error("❌ GEMINI_API_KEY was not loaded. Check the debug logs above.");
}

const genAI = new GoogleGenerativeAI(apiKey);

async function runTest() {
  console.log("📡 Attempting to connect to Gemini with the key from .env file...");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result: GenerateContentResult = await model.generateContent(
    "Hello Gemini, please respond with a short confirmation message."
  );
  const response = result.response;

  console.log("✅ Success! Gemini Response:");
  console.log(response.text());
}

runTest().catch((err) => {
  if (err instanceof Error) {
    console.error("❌ Test Failed:", err.message);
  } else {
    console.error("❌ Test Failed with non-error object:", err);
  }
});