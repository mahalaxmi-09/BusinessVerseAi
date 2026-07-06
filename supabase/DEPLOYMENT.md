# BusinessVerse AI - Production Deployment Guide

This guide details the steps to build, configure, and deploy **BusinessVerse AI** to production systems across Vercel (Frontend React), FastAPI (Python API), and Supabase (PostgreSQL Database).

---

## 1. Environment Variable Reference

### Backend Service (.env)
```bash
# Gateway configurations
PORT=8000
HOST=127.0.0.1

# AI Decision Engine Integration
GEMINI_API_KEY=your_google_gemini_api_key

# JWT Token Secret
JWT_SECRET=your_production_secure_token_signing_secret
```

### Frontend Workspace (.env.production)
```bash
# API endpoint references
VITE_API_URL=https://your-fastapi-backend-url.railway.app
```

---

## 2. Supabase DDL Deployment

1. **Create Project**: Open your [Supabase Dashboard](https://supabase.com) and create a new project.
2. **Apply Schema Migrations**:
   * Navigate to the SQL Editor in Supabase.
   * Open **[00_schema.sql](file:///c:/Users/Mahalakshmi/OneDrive/Desktop/hack-demo/supabase/migrations/00_schema.sql)**, copy all lines, paste, and run.
   * This sets up 25 normalized tables, updates timestamps, B-Tree indexes, and activates Row Level Security (RLS) policies.
3. **Seed Demo Data**:
   * Open **[01_seed.sql](file:///c:/Users/Mahalakshmi/OneDrive/Desktop/hack-demo/supabase/migrations/01_seed.sql)**, copy the contents, paste, and execute.
   * This seeds 12 suppliers, 25 employees, 100 products, 250 customers, and 500 sales.

---

## 3. FastAPI Backend Deployment (e.g., Railway / Render)

The FastAPI server is fully configured to execute on production environments.
1. **GitHub Repository Sync**: Push the repository to GitHub.
2. **Configure Build Settings**:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. **Environment Setup**: Add the `GEMINI_API_KEY` and `JWT_SECRET` variables inside the provider dashboard.

---

## 4. Frontend Vercel Deploy

1. **Install Vercel CLI** (or connect via GitHub integration).
2. **Configure production overrides**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Environment Variables**: Add `VITE_API_URL` matching the deployed FastAPI backend link.
4. **Deploy**: Trigger a production build. The site compiles into static minified assets.
