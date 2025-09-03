"""
Simple AI service for plant disease diagnosis using Google Gemini
"""
import google.generativeai as genai
import base64
import json
import logging
from typing import Dict, Any, List
from config import GEMINI_API_KEY, GEMINI_MODEL

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PlantDiagnosisAI:
    """Simple AI service for plant disease diagnosis"""
    
    def __init__(self):
        """Initialize the Gemini AI client"""
        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel(GEMINI_MODEL)
    
    def create_diagnosis_prompt(self, language: str = "English") -> str:
        """Create a structured prompt for plant disease diagnosis"""
        return f"""
        You are an expert agricultural AI assistant. Analyze this plant image and provide a diagnosis in {language}.
        
        Look for signs of:
        - Plant diseases (fungal, bacterial, viral)
        - Pest damage
        - Nutrient deficiencies
        - Environmental stress
        - Overall plant health
        
        Return your response as a JSON object with this exact structure:
        {{
            "disease_name": "Name of the disease or 'Healthy Plant' if no issues found",
            "description": "Brief explanation of what you observe and the likely cause.",
            "symptoms": ["List of observed symptoms, e.g., 'Yellow spots on leaves', 'Wilting stems'"],
            "treatment": "A single string containing 3-5 actionable treatment steps, separated by newlines (\\n).",
            "prevention": "A single string containing 2-3 actionable prevention tips, separated by newlines (\\n).",
            "confidence": 0.85
        }}
        
        Guidelines:
        - If the plant looks healthy, use "Healthy Plant" as disease_name and provide tips for keeping it healthy.
        - Keep descriptions and recommendations simple and practical for farmers.
        - Ensure 'treatment' and 'prevention' are single strings with steps separated by newlines.
        - 'symptoms' must be an array of strings.
        - 'confidence' should be a float between 0.0 and 1.0.
        - If you are unsure, lower the confidence and suggest consulting an expert.
        - Focus on organic and accessible treatments when possible.
        """
    
    async def diagnose_plant(self, image_data: str, language: str = "English") -> Dict[str, Any]:
        """
        Analyze plant image and return diagnosis
        
        Args:
            image_data: Base64 encoded image data
            language: Language for the response
            
        Returns:
            Dictionary with diagnosis results
        """
        try:
            # Decode base64 image
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            image_bytes = base64.b64decode(image_data)
            
            # Create prompt
            prompt = self.create_diagnosis_prompt(language)
            
            # Prepare image for Gemini
            image_part = {
                "mime_type": "image/jpeg",
                "data": image_bytes
            }
            
            # Call Gemini API
            logger.info(f"Calling Gemini API for plant diagnosis in {language}")
            response = self.model.generate_content([prompt, image_part])
            
            # Parse response
            response_text = response.text.strip()
            
            # Clean up response (remove markdown formatting if present)
            if response_text.startswith('```json'):
                response_text = response_text.replace('```json', '').replace('```', '').strip()
            
            # Parse JSON
            diagnosis_data = json.loads(response_text)
            
            # Validate response structure
            required_fields = ['disease_name', 'description', 'symptoms', 'treatment', 'prevention', 'confidence']
            for field in required_fields:
                if field not in diagnosis_data:
                    raise ValueError(f"Missing required field: {field}")
            
            # Ensure symptoms is a list
            if not isinstance(diagnosis_data.get('symptoms'), list):
                diagnosis_data['symptoms'] = [str(diagnosis_data.get('symptoms', ''))]

            # Ensure confidence is a float between 0 and 1
            confidence = float(diagnosis_data.get('confidence', 0.0))
            diagnosis_data['confidence'] = max(0.0, min(1.0, confidence))
            
            logger.info(f"Successfully diagnosed: {diagnosis_data['disease_name']}")
            return diagnosis_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {e}")
            return self._create_fallback_response(language, "Invalid AI response format")
            
        except Exception as e:
            logger.error(f"AI diagnosis failed: {e}")
            return self._create_fallback_response(language, str(e))
    
    def _create_fallback_response(self, language: str, error_msg: str) -> Dict[str, Any]:
        """Create a fallback response when AI fails"""
        if language.lower() == "hindi":
            return {
                "disease_name": "विश्लेषण असफल",
                "description": f"छवि का विश्लेषण नहीं हो सका: {error_msg}. कृपया छवि की गुणवत्ता जांचें और पुनः प्रयास करें।",
                "symptoms": ["कोई लक्षण नहीं मिला"],
                "treatment": "छवि स्पष्ट और अच्छी रोशनी में हो\nदूसरे कोण से फोटो लें\nइंटरनेट कनेक्शन जांचें",
                "prevention": "स्थानीय कृषि विशेषज्ञ से सलाह लें",
                "confidence": 0.0
            }
        else:
            return {
                "disease_name": "Analysis Failed",
                "description": f"Could not analyze the image: {error_msg}. Please check image quality and try again.",
                "symptoms": ["No symptoms detected"],
                "treatment": "Ensure image is clear and well-lit\nTry taking photo from a different angle\nCheck internet connection",
                "prevention": "Consult a local agricultural expert",
                "confidence": 0.0
            }