from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Civic Sense API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Civic Sense API"}

@app.post("/api/ml/predict-priority")
def predict_priority(description: str, category: str):
    # This is a stub for future ML integration.
    # In a real implementation, this would use an NLP model (e.g. transformers) 
    # to evaluate the severity/priority based on text and category.
    
    score = 0.5 # Default middle score
    
    if "urgent" in description.lower() or "danger" in description.lower():
        score += 0.3
    
    if category in ["water", "power"]:
        score += 0.2
        
    return {"priority_score": min(score, 1.0)}
