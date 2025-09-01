"""
Simple configuration for the plant diagnosis backend
"""
import os
from pathlib import Path

# Load environment variables from root .env file
def load_env():
    # Look for .env in project root (parent of backend)
    env_file = Path(__file__).parent.parent / '.env'
    if env_file.exists():
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

# Load .env file
load_env()

# API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Validate required settings
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is required. Check .env file in project root.")

# AI Configuration
GEMINI_MODEL = "gemini-2.5-flash"
MAX_TOKENS = 1000
TEMPERATURE = 0.3