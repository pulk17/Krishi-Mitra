# 🌱 Krishi Mitra - AI-Powered Plant Health & Yield Assistant

**Krishi Mitra** is an AI-powered agricultural support system that helps farmers and researchers by:

- 🔍 **Diagnosing plant diseases** from uploaded images using **Google Gemini AI**  
- 🌾 **Predicting crop yield** using a trained **LightGBM model**  
- 📊 **Tracking diagnosis history** and storing results securely in **Supabase**  
- 🌐 Supporting **multi-language analysis** (English & Hindi, extendable)  

This monorepo is designed with **pnpm workspaces**, **shared TypeScript types**, and a clean, modular architecture.

---

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/krishi-mitra.git
   cd krishi-mitra
Install dependencies

bash
Copy code
pnpm install
Set up environment variables

bash
Copy code
cp .env.example .env
Add your Google Gemini API key and Supabase credentials.

Start the development servers

bash
Copy code
pnpm dev
Frontend → http://localhost:3000

Backend → http://localhost:3003

📁 Project Structure
bash
Copy code
krishi-mitra/
├── packages/
│   ├── frontend/         # Next.js 14 app (port 3000)
│   ├── backend/          # Express.js API (port 3003)
│   └── types/            # Shared TypeScript types
├── .env                  # Environment variables
├── .env.example          # Example env variables
├── package.json          # Root scripts
└── pnpm-workspace.yaml   # Monorepo config
🛠 Tech Stack
Frontend
Framework: Next.js 14 + TypeScript

Styling: Tailwind CSS, Radix UI, shadcn/ui

State Management: Zustand

Auth: Supabase Auth

Features: Diagnosis flow, multi-language UI, dashboard with analytics

Backend
Framework: Express.js + TypeScript

Database: Supabase (Postgres) with Prisma ORM

AI Integration: Google Gemini AI

File Uploads: Multer (images stored in Supabase Storage)

Security: Supabase JWT authentication middleware

Shared
Package Manager: pnpm

Types: Shared TypeScript types (@krishi-mitra/types)

📝 Scripts
Root
pnpm install:all → Install all dependencies

pnpm dev → Run frontend + backend

pnpm dev:frontend → Run only frontend

pnpm dev:backend → Run only backend

pnpm build → Build both packages

pnpm clean → Remove builds & caches

pnpm db:pull → Sync schema from DB

pnpm db:push → Push schema to DB

Backend
pnpm dev → Run Express dev server

pnpm build → Compile TypeScript

pnpm start → Run production server

pnpm test:gemini → Test Gemini API connection

Frontend
pnpm dev → Run Next.js dev server

pnpm build → Build frontend

pnpm start → Run production frontend

🔧 Environment Variables
Defined in .env:

ini
Copy code
# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=postgres_connection_url
DATABASE_TRANSACTION_URL=postgres_transaction_url

# Server
PORT=3003
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:3003
🗄️ Database
ORM: Prisma

Provider: Supabase PostgreSQL

Schema: packages/backend/prisma/schema.prisma

Migrations:

bash
Copy code
pnpm db:push   # Push schema
pnpm db:pull   # Pull schema
🔗 API Endpoints
Method	Endpoint	Description
GET	/health	Health check
POST	/api/diagnose	Upload plant image for AI diagnosis (auth required)
GET	/api/user/diagnoses	Fetch diagnosis history (auth required)
GET	/api/user/profile	Fetch user profile (auth required)
PUT	/api/user/profile	Update user profile (auth required)

Example Request: Diagnose Plant
bash
Copy code
curl -X POST http://localhost:3003/api/diagnose \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "image=@leaf.jpg" \
  -F "language=en"
Example Response
json
Copy code
{
  "disease_name": "Leaf Blight",
  "confidence": 0.87,
  "symptoms": ["Brown patches", "Yellowing edges"],
  "treatment": "Apply fungicide spray weekly.",
  "prevention": "Avoid overhead irrigation.",
  "language": "en"
}
🌾 Crop Yield Prediction
In addition to plant disease detection, Krishi Mitra includes a crop yield prediction model (packages/backend/Models/Model_test(3).py):

Built with LightGBM

Supports single prediction and batch prediction from CSV

Provides uncertainty/confidence intervals

Saves results to CSV

Example Usage
python
Copy code
from Models.Model_test import CropYieldPredictor

predictor = CropYieldPredictor("production_lightgbm_model.pkl")
predictor.show_required_features()

# Single demo prediction
prediction, sample_data = predictor.demo_prediction()
print("Predicted Yield:", prediction)
🌟 Features
✅ AI-powered plant disease diagnosis

✅ AI-powered crop yield prediction

✅ Secure Supabase authentication

✅ Diagnosis history tracking

✅ Profile management

✅ Supabase Storage for plant images

✅ Type-safe APIs with Zod validation

✅ Multi-language support (English & Hindi)

✅ Responsive UI with Tailwind + shadcn/ui

📜 License
MIT © 2025 Krishi Mitra Team

pgsql
Copy code

---

This is now **one clean GitHub-ready Markdown file** with all sections, examples, and proper formatting ✅  

Do you also want me to add **screenshots / architecture diagram placeholders** in the README , so contributors know where to place visuals?