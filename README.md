# 🌱 Plant Diagnosis App

AI-powered plant disease diagnosis using Google Gemini AI. Simple, clean, and effective.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your API key in .env file
# Edit .env and add: GEMINI_API_KEY=your-api-key

# 3. Start the app
npm start
```

Visit http://localhost:3000 to use the app!

## Project Structure

```
├── frontend/           # Next.js React app
│   ├── app/           # App pages
│   ├── components/    # UI components  
│   └── lib/          # Utilities
├── backend/          # FastAPI Python server
│   ├── main.py      # API server
│   ├── ai_service.py # AI integration
│   └── config.py    # Configuration
├── .env             # Environment variables
├── package.json     # Root scripts
└── README.md       # This file
```

## Features

- 📱 **Modern UI**: Clean interface with shadcn/ui components
- 🤖 **AI Diagnosis**: Powered by Google Gemini 1.5 Flash
- 🌍 **Multi-language**: English, Hindi, Spanish support
- 📊 **Dashboard**: Stats and progress tracking
- 🔒 **Secure**: No data storage, stateless design
- 📱 **Mobile-first**: Responsive design

## API Key Setup

1. Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Edit `.env` file in project root
3. Add: `GEMINI_API_KEY=your-actual-api-key`

## Manual Setup

```bash
# Backend
cd backend
pip install -r requirements.txt
python main.py

# Frontend (new terminal)
cd frontend  
npm install
npm run dev
```

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python
- **AI**: Google Gemini 1.5 Flash API
- **UI**: shadcn/ui components
