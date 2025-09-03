# 🌱 Krishi Mitra - AI Plant Disease Detection

**Krishi Mitra** (Sanskrit: कृषि मित्र, meaning "Farmer's Friend") is a comprehensive AI-powered plant disease diagnosis application with user authentication and data persistence. It helps farmers and gardeners identify plant diseases, get treatment recommendations, and track their plant health history over time.

## ✨ Features

- 🔐 **Google OAuth Authentication**: Secure sign-in with Google accounts
- 🤖 **AI-Powered Diagnosis**: Uses Google Gemini 1.5 Flash for accurate plant disease detection
- 🌍 **Multi-Language Support**: Available in English, Hindi, and Spanish
- 📱 **Mobile-First Design**: Responsive interface that works on all devices
- 📊 **Dashboard Analytics**: Track diagnosis history and plant health statistics
- 💾 **Data Persistence**: Store diagnoses and conversations with Supabase
- ⚡ **Real-Time Results**: Get instant diagnosis and treatment recommendations
- 🎨 **Modern UI**: Beautiful landing page and dashboard with shadcn/ui components
- 📈 **Health Tracking**: Monitor plant health trends over time
- 🔒 **Secure Data**: Row-level security ensures your data stays private

## 🚀 Quick Start

```bash
# 1. Clone and setup
git clone <repository-url>
cd plant-diagnosis-app

# 2. Install all dependencies
npm install

# 3. Configure API key
cp .env.example .env
# Edit .env and add your Google Gemini API key

# 4. Start the application
npm start
```

Visit **http://localhost:3000** to use the app!

## 🔧 Environment Setup

### Get Your API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file:

```bash
GEMINI_API_KEY=your-google-gemini-api-key-here
```

### Manual Setup (Alternative)
```bash
# Backend setup
cd backend
pip install -r requirements.txt
python main.py

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
plant-diagnosis-app/
├── 📁 frontend/                    # Next.js React Application
│   ├── 📁 app/                     # Next.js App Router
│   │   ├── globals.css             # Global styles and CSS variables
│   │   ├── layout.tsx              # Root layout with metadata
│   │   └── page.tsx                # Main application page
│   ├── 📁 components/              # React Components
│   │   ├── 📁 ui/                  # Reusable UI primitives
│   │   │   ├── alert.tsx           # Alert/notification component
│   │   │   ├── button.tsx          # Button component variants
│   │   │   ├── card.tsx            # Card container component
│   │   │   ├── loading-spinner.tsx # Loading animation component
│   │   │   ├── progress.tsx        # Progress bar component
│   │   │   └── select.tsx          # Dropdown select component
│   │   ├── DiagnosisFlow.tsx       # Main diagnosis workflow
│   │   ├── Footer.tsx              # Application footer
│   │   ├── Header.tsx              # Navigation header
│   │   ├── ImageUploader.tsx       # Image upload and preview
│   │   ├── LanguageSelector.tsx    # Language switching component
│   │   ├── ResultsDisplay.tsx      # Diagnosis results display
│   │   ├── WelcomeBanner.tsx       # Welcome message component
│   │   └── dashboard-stats.tsx     # Statistics dashboard
│   ├── 📁 hooks/                   # Custom React Hooks
│   │   └── useDiagnosis.ts         # Diagnosis API integration hook
│   ├── 📁 lib/                     # Utilities and Types
│   │   └── utils.ts                # Utility functions and type definitions
│   ├── package.json                # Frontend dependencies
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── tsconfig.json               # TypeScript configuration
│   └── postcss.config.js           # PostCSS configuration
├── 📁 backend/                     # FastAPI Python Server
│   ├── main.py                     # FastAPI application and routes
│   ├── ai_service.py               # Google Gemini AI integration
│   ├── config.py                   # Configuration management
│   └── requirements.txt            # Python dependencies
├── 📁 node_modules/                # Dependencies (auto-generated)
├── .env                            # Environment variables (create from .env.example)
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── package.json                    # Root project configuration and scripts
└── README.md                       # This documentation
```

## 📋 File Descriptions

### Frontend Files

#### Core Application
- **`app/page.tsx`**: Main application entry point that orchestrates all components
- **`app/layout.tsx`**: Root layout defining HTML structure, metadata, and global styling
- **`app/globals.css`**: Global CSS styles, Tailwind imports, and CSS custom properties

#### Components
- **`DiagnosisFlow.tsx`**: Central component managing the diagnosis workflow and state
- **`ImageUploader.tsx`**: Handles image upload, preview, and validation
- **`ResultsDisplay.tsx`**: Displays diagnosis results with treatment recommendations
- **`LanguageSelector.tsx`**: Language switching interface for multi-language support
- **`Header.tsx`** & **`Footer.tsx`**: Navigation and branding components
- **`WelcomeBanner.tsx`**: User greeting and app introduction
- **`dashboard-stats.tsx`**: Statistics and analytics display

#### UI Components (shadcn/ui)
- **`ui/button.tsx`**: Reusable button component with multiple variants
- **`ui/card.tsx`**: Container component for content sections
- **`ui/alert.tsx`**: Alert and notification display component
- **`ui/progress.tsx`**: Progress bar for loading states
- **`ui/select.tsx`**: Dropdown selection component
- **`ui/loading-spinner.tsx`**: Loading animation component

#### Utilities
- **`hooks/useDiagnosis.ts`**: Custom React hook for API communication and state management
- **`lib/utils.ts`**: Utility functions (className merging) and TypeScript type definitions

### Backend Files

- **`main.py`**: FastAPI server with CORS setup, route definitions, and error handling
- **`ai_service.py`**: Google Gemini AI integration for image analysis and diagnosis
- **`config.py`**: Configuration management for API keys and environment variables
- **`requirements.txt`**: Python package dependencies

### Configuration Files

- **`package.json`** (root): Project scripts for development, building, and deployment
- **`frontend/package.json`**: Frontend-specific dependencies and scripts
- **`tailwind.config.js`**: Tailwind CSS configuration with custom theme
- **`tsconfig.json`**: TypeScript compiler configuration
- **`postcss.config.js`**: PostCSS configuration for CSS processing

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.8+
- **AI Service**: Google Generative AI (Gemini 1.5 Flash)
- **Server**: Uvicorn ASGI server
- **Data Validation**: Pydantic

### Development Tools
- **Package Manager**: npm (frontend), pip (backend)
- **Process Manager**: concurrently (for running both servers)
- **Code Quality**: TypeScript, ESLint (built into Next.js)

## 🔄 API Endpoints

### Backend API (`http://localhost:8000`)

#### `GET /`
Health check endpoint
```json
{
  "message": "Plant Diagnosis API is running"
}
```

#### `GET /health`
Detailed health status
```json
{
  "status": "healthy",
  "service": "plant-diagnosis-api", 
  "version": "1.0.0"
}
```

#### `POST /diagnose`
Main diagnosis endpoint

**Request:**
```json
{
  "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
  "language": "English"
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "disease_name": "Leaf Spot Disease",
  "description": "Detailed description of the disease...",
  "treatment": ["Treatment step 1", "Treatment step 2"],
  "confidence": 0.85,
  "timestamp": "2025-01-09T10:30:00"
}
```

## 🚀 Development

### Available Scripts

```bash
# Install all dependencies (frontend + backend)
npm install

# Start both frontend and backend in development mode
npm run dev

# Install only backend dependencies
npm run install:backend

# Install only frontend dependencies  
npm run install:frontend

# Start only backend server
npm run dev:backend

# Start only frontend server
npm run dev:frontend

# Build frontend for production
npm run build
```

### Development Workflow

1. **Start Development**: `npm run dev` starts both servers concurrently
2. **Frontend**: Runs on `http://localhost:3000` with hot reload
3. **Backend**: Runs on `http://localhost:8000` with auto-reload
4. **API Documentation**: Visit `http://localhost:8000/docs` for interactive API docs

## 🌐 Multi-Language Support

The app supports three languages:
- **English**: Default language
- **Hindi**: हिंदी भाषा समर्थन
- **Spanish**: Soporte en español

Language selection affects:
- AI diagnosis responses
- Treatment recommendations
- User interface text (planned)

## 🔒 Security & Privacy

- **No Data Storage**: Images and results are not stored anywhere
- **Stateless Design**: Each request is independent
- **CORS Protection**: Configured for specific frontend origin
- **API Key Security**: Environment variables for sensitive data
- **Input Validation**: Pydantic models ensure data integrity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill processes on ports 3000 or 8000
npx kill-port 3000 8000
```

**API Key Issues**
- Ensure `.env` file exists in project root
- Verify API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Check for extra spaces or quotes in `.env` file

**Python Dependencies**
```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt
```

**Node Dependencies**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the API documentation at `http://localhost:8000/docs`
3. Create an issue in the repository

---

**Made with ❤️ for farmers and plant enthusiasts worldwide**
