# RecoveryAI – AI Powered Recovery & Prevention Platform

> **Tagline**: Your AI Recovery Companion  
> **Hackathon Submission**: Google PromptWars (Build with AI)  
> **Challenge**: Multi-Modal GenAI-Powered Recovery & Prevention Platform

---

## 🌟 Executive Summary

**RecoveryAI** is a production-grade, full-stack web application engineered to support individuals navigating substance use disorders and their caregivers during moments of highest cognitive load.

When acute cravings, panic spikes, or high-stress triggers occur, complex traditional user interfaces and typing fail. RecoveryAI utilizes Generative AI (Google Gemini) as its core engine to provide **zero-typing voice-first interventions**, **personalized emergency scripts**, **caregiver guidance**, **interactive breathing exercises**, and **context-aware safety monitoring**.

---

## ✨ Key Features & Connected Workflows

1. **Voice AI Recovery Coach (Feature 1 - Primary)**: Hands-free voice recognition (`Web SpeechRecognition API`) converts natural speech to text, sending transcripts to Gemini AI. Gemini generates an empathetic response, 5-4-3-2-1 sensory grounding, 4-4-6 breathing step, immediate micro-action, motivational advice, and healthy distraction—spoken aloud via `Web SpeechSynthesis API`.
2. **SOS Emergency Mode (Feature 2)**: Single-tap emergency button calls Gemini to instantly synthesize a personalized emergency script, coping checklist, breathing instructions, ready-to-send SMS message for trusted support leads, and panic reset exercises. Includes Copy, Share, Speak Aloud, Download, and direct 988/SAMHSA hotline triggers.
3. **Caregiver Assistant (Feature 3)**: Dedicated guidance hub for family members and support leads. Provides actionable answers to critical questions (*"How should I respond?"*, *"What should I avoid saying?"*, *"What warning signs should I monitor?"*, *"How do I de-escalate safely?"*).
4. **AI Education Hub (Feature 4)**: Interactive search and category explorer for withdrawal biology, relapse prevention, coping techniques, therapy options, and family support, powered by Gemini evidence-based synthesis.
5. **Daily Recovery Check-In (Feature 5)**: Multi-metric assessment (Mood, Stress, Sleep, Energy, Cravings, Journal text/voice). Gemini evaluates holistic scores to return Recovery Summary, Risk Status (Low / Moderate / High), and personalized action steps.
6. **Context-Aware Safety Analyzer (Feature 6)**: Automated safety engine evaluating high-risk indicators (cravings > 7, stress > 8, self-isolation, insomnia) and generating immediate grounding, hydration care, and social outreach recommendations.
7. **Guided 4-4-6 Breathing Tool (Feature 7)**: Interactive visual box breathing circle with rhythmically timed phases (Inhale 4s, Hold 4s, Exhale 6s), audio cue options, and cycle counter.
8. **Personal Recovery Toolkit (Feature 8)**: Support contact manager, AI daily affirmations, healthy distraction generator, and personal journal.
9. **Progress & Analytics Page (Feature 9)**: Visual trend history charts, recovery streak tracking, milestone badges, and an AI Weekly Summary Report generator.
10. **Settings & Accessibility (Feature 10)**: SpeechSynthesis voice selector, speech rate/pitch sliders, large typography mode, dark glassmorphism theme, and data export/reset.

---

## 🏗️ Architecture & Folder Structure

```
promptwar/
├── README.md                          # Production GitHub documentation & setup guide
├── LICENSE                            # MIT License
├── .gitignore                         # Excludes node_modules & build artifacts (<10MB repo)
├── .env.example                       # Shared environment template
├── render.yaml                        # Render deployment configuration for backend
├── frontend/                          # Vite + React 19 + TypeScript App
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── vercel.json                    # Vercel deployment spec
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx                    # Main App with Router & Context Providers
│       ├── index.css                  # Global styles & glassmorphism design system
│       ├── types/                     # TypeScript contracts
│       ├── context/                   # React Context (RecoveryContext, VoiceContext)
│       ├── services/                  # API client service layer
│       ├── components/                # Reusable UI primitives (Card, Button, BreathingCircle, etc.)
│       └── pages/                     # Full application views (10 core features)
└── backend/                           # Python FastAPI Application
    ├── requirements.txt               # Backend dependencies
    ├── .env.example
    └── app/
        ├── main.py                    # FastAPI entrypoint & CORS middleware
        ├── config.py                  # Environment settings
        ├── schemas.py                 # Pydantic data schemas
        ├── prompts.py                 # Gemini prompt templates
        ├── services/
        │   └── gemini_service.py      # Real Gemini API integration & dynamic fallback engine
        └── routers/
            ├── ai.py                  # Endpoints (/coach, /emergency, /caregiver, /education, /checkin, /safety)
            └── health.py              # Health check status API
```

---

## 🛠️ Tech Stack & GenAI Integration

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS + Custom Glassmorphism CSS Design System
- **Animations**: Framer Motion
- **Icons**: Lucide Icons
- **Voice APIs**: Web Speech Recognition API (`webkitSpeechRecognition`) + Web SpeechSynthesis API

### Backend
- **Framework**: Python FastAPI + Uvicorn
- **Validation**: Pydantic v2
- **GenAI Service**: Google Gemini API via official `google-genai` / `google-generativeai` SDK
- **Model**: `gemini-2.5-flash`

---

## 🚀 Local Installation & Setup

### Prerequisites
- Node.js v18+ & NPM
- Python 3.10+

### 1. Clone & Configure Environment
```bash
git clone https://github.com/your-username/promptwar.git
cd promptwar

# Copy environment template
cp .env.example backend/.env
```

Edit `backend/.env` to add your Gemini API Key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key
```

### 2. Start Backend Server
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend will run at: `http://localhost:8000` (API Docs at `http://localhost:8000/docs`).

### 3. Start Frontend App
```bash
cd frontend
npm install
npm run dev
```
Frontend application will open at: `http://localhost:5173`.

---

## ☁️ Deployment Instructions

### Frontend -> Vercel
1. Import the `frontend/` directory into Vercel.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Deploy! (`vercel.json` automatically proxies `/api/*` to the backend).

### Backend -> Render
1. Create a New Web Service on Render pointing to the root directory.
2. Select Environment: `Python`
3. Build Command: `pip install -r backend/requirements.txt`
4. Start Command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variable: `GEMINI_API_KEY` = `your_key`

---

## 📜 License & Credit

Made with Harish P.G. for compassionate AI healthcare.  
This project is licensed under the [MIT License](LICENSE).
