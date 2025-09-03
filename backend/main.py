"""
Simple Plant Diagnosis Backend
FastAPI server with minimal dependencies and clean structure
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
from datetime import datetime
from typing import List, Optional
from ai_service import PlantDiagnosisAI
from config import ALLOWED_ORIGINS

# Create FastAPI app
app = FastAPI(
    title="Plant Diagnosis API",
    description="Simple AI-powered plant disease diagnosis",
    version="1.0.0"
)

# Add CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI service
ai_service = PlantDiagnosisAI()

# Data models
class DiagnosisRequest(BaseModel):
    imageData: str  # base64 encoded image
    language: str = "English"

class DiagnosisResponse(BaseModel):
    id: str
    disease_name: str
    description: str
    symptoms: List[str]
    treatment: str
    prevention: str
    confidence: float
    timestamp: str

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "Plant Diagnosis API is running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "plant-diagnosis-api",
        "version": "1.0.0"
    }

# Main diagnosis endpoint
@app.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose_plant(request: DiagnosisRequest):
    """
    Analyze plant image and return diagnosis using AI
    """
    try:
        # Validate input
        if not request.imageData:
            raise HTTPException(status_code=400, detail="Image data is required")
        
        # Call AI service
        diagnosis_result = await ai_service.diagnose_plant(
            image_data=request.imageData,
            language=request.language
        )
        
        # Create response
        response = DiagnosisResponse(
            id=str(uuid.uuid4()),
            disease_name=diagnosis_result["disease_name"],
            description=diagnosis_result["description"],
            symptoms=diagnosis_result["symptoms"],
            treatment=diagnosis_result["treatment"],
            prevention=diagnosis_result["prevention"],
            confidence=diagnosis_result["confidence"],
            timestamp=datetime.now().isoformat()
        )
        
        return response
        
    except Exception as e:
        # Return error response
        raise HTTPException(
            status_code=500, 
            detail=f"Diagnosis failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)