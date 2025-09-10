# Krishi Mitra - AI-Powered Plant Disease Diagnosis

A clean, modern monorepo for an intelligent plant disease diagnosis system that uses AI to analyze plant images and provide treatment recommendations.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development servers
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) for frontend and [http://localhost:3001](http://localhost:3001) for backend.

## 📁 Project Structure

```
krishi-mitra/
├── packages/
│   ├── frontend/          # Next.js app (port 3000)
│   ├── backend/           # Express API (port 3001)
│   └── types/             # Shared TypeScript types
├── .env                   # Environment variables
└── pnpm-workspace.yaml    # Monorepo configuration
```

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, TypeScript, Google Gemini AI
- **Database**: Supabase (PostgreSQL)
- **Monorepo**: pnpm workspaces

## 📝 Scripts

```bash
pnpm dev              # Start both frontend & backend
pnpm build            # Build all packages
pnpm dev:frontend     # Frontend only
pnpm dev:backend      # Backend only
pnpm clean            # Clean build artifacts
```

## 🔧 Environment Variables

Required in `.env`:
- `GEMINI_API_KEY` - Google Gemini API key
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

## 🌟 Features

- ✅ Clean monorepo structure with shared types
- ✅ TypeScript throughout
- ✅ AI-powered plant disease diagnosis
- ✅ Multi-language support (EN, HI, ES)
- ✅ User authentication & profiles
- ✅ Diagnosis history tracking
- ✅ Responsive design

## 🔗 API Endpoints

- `GET /health` - Health check
- `POST /api/diagnose` - Analyze plant image
- `GET /api/user/diagnoses` - User diagnosis history
- `GET /api/user/profile` - User profile
- `PUT /api/user/profile` - Update profile

All user endpoints require authentication.