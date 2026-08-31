# How to Run the Project

This guide provides the exact terminal commands to start both the backend and frontend services for the **Polar Nexus Portal**.

---

## 1. Backend (Terminal 1)

Open PowerShell and execute:

```powershell
# Navigate to backend
cd p:\SIH\polar-nexus-builder\backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Start FastAPI backend server with Uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

> **Backend API URL:** http://localhost:8000  
> **Interactive Swagger Docs:** http://localhost:8000/docs  
> **ReDoc Documentation:** http://localhost:8000/redoc  

---

## 2. Frontend (Terminal 2)

Open a second PowerShell window and execute:

```powershell
# Navigate to frontend
cd p:\SIH\polar-nexus-builder\frontend

# Start Next.js development server
npm run dev
```

> **Frontend Web Portal:** http://localhost:3000  

---

## Quick Access Overview

| Service | Port | Local URL |
| :--- | :--- | :--- |
| **Frontend (Next.js)** | `3000` | [http://localhost:3000](http://localhost:3000) |
| **Backend (FastAPI)** | `8000` | [http://localhost:8000](http://localhost:8000) |
| **API Docs (Swagger)** | `8000` | [http://localhost:8000/docs](http://localhost:8000/docs) |
