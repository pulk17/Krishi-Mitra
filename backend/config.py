"""
Simple configuration for the plant diagnosis backend
"""
import os
from dotenv import load_dotenv

# Load environment variables from the project root's .env file
load_dotenv()

# API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Supabase Configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Validate required settings
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is required. Check .env file in project root.")

# AI Configuration
GEMINI_MODEL = "gemini-2.5-flash"
MAX_TOKENS = 1000
TEMPERATURE = 0.3

# CORS Configuration
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://localhost:3000"
]