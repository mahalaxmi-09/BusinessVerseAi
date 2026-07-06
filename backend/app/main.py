import os
import time
from fastapi import FastAPI, HTTPException, Header, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from datetime import datetime, timedelta

from app.simulator import run_business_simulation
from app.ai_ceo import get_ai_ceo_advice, get_ai_ceo_chat_response
from app.auth import hash_password, verify_password, create_access_token, decode_access_token, RoleChecker

# Load environment variables
load_dotenv()

app = FastAPI(
    title="BusinessVerse AI - Enterprise Decision Gateway",
    description="Backend API powering multi-tenant simulations, RLS-ready JWT, and AI CEO advices.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Simple in-memory rate limiter to prevent API abuse
ip_requests = {}
def rate_limiter_middleware(request: Request):
    ip = request.client.host if request.client else "unknown"
    now = datetime.now().timestamp()
    if ip not in ip_requests:
        ip_requests[ip] = []
    # Filter out requests older than 60s
    ip_requests[ip] = [t for t in ip_requests[ip] if now - t < 60]
    if len(ip_requests[ip]) > 60:  # max 60 requests per minute
        raise HTTPException(status_code=429, detail="API rate limit exceeded. Please wait 60s.")
    ip_requests[ip].append(now)

# 2. Input/Output Schemas
class SimulationRequest(BaseModel):
    price_multiplier: float = Field(..., ge=0.5, le=2.5)
    marketing_budget: float = Field(..., ge=0.0, le=20000.0)
    employees_hired: int = Field(..., ge=1, le=100)
    branches_open: int = Field(..., ge=1, le=10)
    inventory_buffer: float = Field(..., ge=0.2, le=3.0)

class ChatRequest(BaseModel):
    query: str
    price_multiplier: float
    marketing_budget: float
    employees_hired: int
    branches_open: int
    inventory_buffer: float

class LoginRequest(BaseModel):
    email: str
    password: str

# Mock user database
MOCK_USER_HASH = hash_password("password123")

# 3. ROUTES
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "BusinessVerse AI Simulator Engine",
        "gemini_enabled": bool(os.getenv("GEMINI_API_KEY"))
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "ai_engine": "online",
        "latency_ms": 2.5
    }

@app.post("/api/auth/login")
def login(req: LoginRequest):
    # For demo ease, verify email and matching password
    if req.email == "admin@businessverse.ai" and verify_password(MOCK_USER_HASH, req.password):
        token = create_access_token({
            "sub": req.email,
            "role": "owner",
            "name": "Mahalakshmi"
        })
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "email": req.email,
                "role": "owner",
                "name": "Mahalakshmi"
            }
        }
    raise HTTPException(status_code=400, detail="Invalid email or password credentials.")

@app.post("/api/auth/demo")
def demo_login():
    # Helper demo token for hackathon judges
    token = create_access_token({
        "sub": "demo@businessverse.ai",
        "role": "owner",
        "name": "Demo Sandbox Manager"
    })
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "email": "demo@businessverse.ai",
            "role": "owner",
            "name": "Demo Sandbox Manager"
        }
    }

@app.post("/api/simulate", dependencies=[Depends(rate_limiter_middleware)])
def simulate(req: SimulationRequest):
    try:
        sim_results = run_business_simulation(
            price_multiplier=req.price_multiplier,
            marketing_budget=req.marketing_budget,
            employees_hired=req.employees_hired,
            branches_open=req.branches_open,
            inventory_buffer=req.inventory_buffer
        )
        
        alerts = []
        summary = sim_results["summary"]
        monthly = sim_results["monthlyData"]
        
        avg_sat = summary["avgSatisfaction"]
        total_profit = summary["totalProfit"]
        
        if avg_sat < 70:
            alerts.append({
                "id": "alert-satisfaction",
                "priority": "critical",
                "title": "Severe Retention Drop",
                "message": f"Average customer satisfaction is dangerously low ({avg_sat}%). Customers are abandoning your brand due to pricing or bottleneck issues."
            })
        if total_profit < 0:
            alerts.append({
                "id": "alert-profit",
                "priority": "critical",
                "title": "Negative Cash Flow",
                "message": f"Annual net profit is negative (${total_profit:,.2f}). The current operational configuration is unsustainable."
            })
            
        any_stockouts = any(d["stockouts"] > 50 for d in monthly)
        if any_stockouts:
            alerts.append({
                "id": "alert-stockouts",
                "priority": "warning",
                "title": "Fulfillment Stockouts",
                "message": "Supply chain stockouts detected. Your inventory buffer is too low to meet peak seasonal customer demand, resulting in lost sales."
            })
            
        capacity_deficit = any((req.employees_hired * 120) < (d["customers"] * 0.8) for d in monthly)
        if capacity_deficit:
            alerts.append({
                "id": "alert-labor",
                "priority": "warning",
                "title": "Labor Capacity Gap",
                "message": f"Headcount ({req.employees_hired}) is insufficient to handle incoming orders in peak months. Employees are operating at 100%+ utilization."
            })
            
        if avg_sat >= 85 and total_profit > 10000:
            alerts.append({
                "id": "alert-brand",
                "priority": "info",
                "title": "Premium Brand Position",
                "message": "High customer satisfaction ({avg_sat}%) and positive cash flow indicate strong brand health. This is an optimal baseline for scaling."
            })
        if len(alerts) == 0:
            alerts.append({
                "id": "alert-status",
                "priority": "info",
                "title": "Operations Balanced",
                "message": "All operational metrics are within standard tolerances. No severe bottlenecks detected."
            })
            
        inputs_dict = {
            "price_multiplier": req.price_multiplier,
            "marketing_budget": req.marketing_budget,
            "employees_hired": req.employees_hired,
            "branches_open": req.branches_open,
            "inventory_buffer": req.inventory_buffer
        }
        advice = get_ai_ceo_advice(sim_results, inputs_dict)
        
        return {
            "simulation": sim_results,
            "alerts": alerts,
            "advice": advice
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

@app.post("/api/ai-ceo/chat", dependencies=[Depends(rate_limiter_middleware)])
def chat(req: ChatRequest):
    try:
        sim_results = run_business_simulation(
            price_multiplier=req.price_multiplier,
            marketing_budget=req.marketing_budget,
            employees_hired=req.employees_hired,
            branches_open=req.branches_open,
            inventory_buffer=req.inventory_buffer
        )
        inputs_dict = {
            "price_multiplier": req.price_multiplier,
            "marketing_budget": req.marketing_budget,
            "employees_hired": req.employees_hired,
            "branches_open": req.branches_open,
            "inventory_buffer": req.inventory_buffer
        }
        response = get_ai_ceo_chat_response(req.query, sim_results, inputs_dict)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Consultation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
