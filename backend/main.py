"""
Civic Sense API — Production Backend
ML-powered civic issue analysis endpoints.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from dotenv import load_dotenv
import os

load_dotenv()

# ── ML Engine ──
from core.ml import (
    predict_priority,
    classify_issue,
    find_duplicates,
    cluster_issues,
)

# ── Supabase Client ──
from core.supabase import supabase

# ── App Init ──
app = FastAPI(
    title="Civic Sense ML API",
    description="ML-powered civic issue analysis: priority prediction, duplicate detection, auto-classification, and geo-clustering.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ════════════════════════════════════════════════════════════════════════════
# Request / Response Models
# ════════════════════════════════════════════════════════════════════════════

class PriorityRequest(BaseModel):
    description: str = Field(..., min_length=5, examples=["Large pothole causing accidents on main road"])
    category: str = Field(..., examples=["pothole"])
    upvotes: int = Field(default=0, ge=0)
    age_days: int = Field(default=0, ge=0)

class ClassifyRequest(BaseModel):
    description: str = Field(..., min_length=5, examples=["Water is leaking from the broken pipe near the junction"])

class DuplicateRequest(BaseModel):
    description: str = Field(..., min_length=5)
    category: str = Field(..., examples=["pothole"])
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius_meters: float = Field(default=500, ge=50, le=5000)
    threshold: float = Field(default=0.3, ge=0.1, le=1.0)

class ClusterRequest(BaseModel):
    cell_size_meters: float = Field(default=500, ge=100, le=5000)

class AnalyticsResponse(BaseModel):
    total_issues: int
    by_status: dict
    by_category: dict
    avg_resolution_days: float
    hotspot_count: int


# ════════════════════════════════════════════════════════════════════════════
# Health Check
# ════════════════════════════════════════════════════════════════════════════

@app.get("/", tags=["Health"])
def root():
    return {
        "service": "Civic Sense ML API",
        "status": "operational",
        "version": "1.0.0",
        "endpoints": [
            "/api/ml/predict-priority",
            "/api/ml/classify",
            "/api/ml/duplicates",
            "/api/ml/clusters",
            "/api/ml/analytics",
        ]
    }

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}


# ════════════════════════════════════════════════════════════════════════════
# 1. Priority Prediction
# ════════════════════════════════════════════════════════════════════════════

@app.post("/api/ml/predict-priority", tags=["ML"])
def api_predict_priority(req: PriorityRequest):
    """
    Predict issue priority using NLP keyword analysis + category severity.
    
    Analyzes description text for urgency keywords, combines with category
    severity, community upvotes, and issue age to produce a priority score.
    """
    result = predict_priority(
        description=req.description,
        category=req.category,
        upvotes=req.upvotes,
        age_days=req.age_days,
    )
    return {"prediction": result}


# ════════════════════════════════════════════════════════════════════════════
# 2. Auto-Classification
# ════════════════════════════════════════════════════════════════════════════

@app.post("/api/ml/classify", tags=["ML"])
def api_classify(req: ClassifyRequest):
    """
    Auto-classify issue category from description text.
    
    Analyzes keywords in the description to predict the most likely
    category (pothole, streetlight, garbage, water_leakage, other).
    """
    result = classify_issue(req.description)
    return {"classification": result}


# ════════════════════════════════════════════════════════════════════════════
# 3. Duplicate Detection
# ════════════════════════════════════════════════════════════════════════════

@app.post("/api/ml/duplicates", tags=["ML"])
def api_find_duplicates(req: DuplicateRequest):
    """
    Find potential duplicate issues using text similarity + geo proximity.
    
    Compares the new issue description against existing issues in the database
    using cosine similarity on TF vectors, with bonuses for category match
    and geographic proximity.
    """
    try:
        # Fetch existing issues from Supabase
        response = supabase.table("issues").select(
            "id, title, description, category, latitude, longitude, status"
        ).limit(200).execute()
        
        existing = response.data if response.data else []
    except Exception as e:
        # If Supabase fails, return empty (no duplicates found)
        print(f"[ML API] Supabase fetch failed: {e}")
        existing = []
    
    duplicates = find_duplicates(
        new_text=req.description,
        new_category=req.category,
        existing_issues=existing,
        threshold=req.threshold,
        new_lat=req.latitude,
        new_lng=req.longitude,
        radius_meters=req.radius_meters,
    )
    
    return {
        "duplicates_found": len(duplicates),
        "duplicates": duplicates,
        "checked_against": len(existing),
    }


# ════════════════════════════════════════════════════════════════════════════
# 4. Geo-Clustering / Hotspot Detection
# ════════════════════════════════════════════════════════════════════════════

@app.post("/api/ml/clusters", tags=["ML"])
def api_clusters(req: ClusterRequest):
    """
    Cluster all issues geographically to identify hotspots.
    
    Uses grid-based spatial hashing to group nearby issues.
    Clusters with 3+ issues are flagged as hotspots.
    """
    try:
        response = supabase.table("issues").select(
            "id, category, latitude, longitude, status"
        ).limit(500).execute()
        
        issues = response.data if response.data else []
    except Exception as e:
        print(f"[ML API] Supabase fetch failed: {e}")
        issues = []
    
    clusters = cluster_issues(issues, cell_size_meters=req.cell_size_meters)
    hotspots = [c for c in clusters if c["is_hotspot"]]
    
    return {
        "total_clusters": len(clusters),
        "hotspot_count": len(hotspots),
        "clusters": clusters,
        "hotspots": hotspots,
    }


# ════════════════════════════════════════════════════════════════════════════
# 5. Analytics Dashboard Data
# ════════════════════════════════════════════════════════════════════════════

@app.get("/api/ml/analytics", tags=["Analytics"])
def api_analytics():
    """
    Aggregated analytics for the admin dashboard.
    
    Returns total issues, breakdowns by status and category,
    average resolution time, and hotspot count.
    """
    try:
        response = supabase.table("issues").select(
            "id, status, category, created_at, updated_at, latitude, longitude"
        ).limit(1000).execute()
        
        issues = response.data if response.data else []
    except Exception as e:
        print(f"[ML API] Supabase fetch failed: {e}")
        return {
            "total_issues": 0,
            "by_status": {},
            "by_category": {},
            "avg_resolution_days": 0,
            "hotspot_count": 0,
        }
    
    # Count by status
    by_status: dict = {}
    for issue in issues:
        st = issue.get("status", "open")
        by_status[st] = by_status.get(st, 0) + 1
    
    # Count by category
    by_category: dict = {}
    for issue in issues:
        cat = issue.get("category", "other")
        by_category[cat] = by_category.get(cat, 0) + 1
    
    # Avg resolution time (for resolved issues)
    resolution_days = []
    for issue in issues:
        if issue.get("status") == "resolved" and issue.get("created_at") and issue.get("updated_at"):
            from datetime import datetime
            try:
                created = datetime.fromisoformat(issue["created_at"].replace("Z", "+00:00"))
                updated = datetime.fromisoformat(issue["updated_at"].replace("Z", "+00:00"))
                days = (updated - created).total_seconds() / 86400
                if days >= 0:
                    resolution_days.append(days)
            except:
                pass
    
    avg_resolution = round(sum(resolution_days) / len(resolution_days), 1) if resolution_days else 0
    
    # Hotspots
    clusters = cluster_issues(issues)
    hotspot_count = sum(1 for c in clusters if c["is_hotspot"])
    
    return {
        "total_issues": len(issues),
        "by_status": by_status,
        "by_category": by_category,
        "avg_resolution_days": avg_resolution,
        "hotspot_count": hotspot_count,
    }
