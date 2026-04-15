"""
Civic Sense ML Service — Text-based NLP utilities.
Uses TF-IDF vectorization and cosine similarity for duplicate detection
and keyword extraction for priority prediction.
No heavy ML framework needed — pure Python + math.
"""

import re
import math
from collections import Counter
from typing import List, Dict, Tuple

# ── Severity weights by category ──
SEVERITY_WEIGHTS = {
    "pothole": 8,
    "water_leakage": 9,
    "water": 9,
    "streetlight": 6,
    "garbage": 5,
    "other": 4,
}

# ── Urgency keywords with weights ──
URGENCY_KEYWORDS = {
    # Critical
    "emergency": 5, "danger": 5, "dangerous": 5, "collapse": 5,
    "flood": 5, "fire": 5, "electric": 5, "electrocution": 5,
    # High
    "urgent": 4, "severe": 4, "broken": 3, "burst": 4,
    "sinkhole": 4, "accident": 4, "injury": 4, "hazard": 4,
    # Medium
    "leaking": 3, "blocked": 3, "overflowing": 3, "cracked": 3,
    "damaged": 3, "fallen": 3, "exposed": 3, "sewage": 3,
    # Low
    "pothole": 2, "garbage": 1, "litter": 1, "graffiti": 1,
    "dim": 1, "flickering": 2, "noisy": 1,
}

# ── Stopwords ──
STOPWORDS = {
    "the", "a", "an", "is", "it", "in", "on", "at", "to", "and",
    "or", "of", "for", "with", "this", "that", "from", "by", "has",
    "have", "had", "was", "were", "be", "been", "are", "not", "but",
    "there", "here", "very", "also", "just", "so", "than", "then",
    "we", "our", "my", "me", "you", "your", "i", "he", "she", "they",
}

def tokenize(text: str) -> List[str]:
    """Lowercase, remove punctuation, split into words, remove stopwords."""
    words = re.findall(r'[a-z]+', text.lower())
    return [w for w in words if w not in STOPWORDS and len(w) > 1]


def predict_priority(description: str, category: str, upvotes: int = 0, age_days: int = 0) -> Dict:
    """
    Priority prediction using keyword analysis + category severity.
    Returns score (0-1), level (low/medium/high/critical), and reasoning.
    """
    tokens = tokenize(description)
    severity = SEVERITY_WEIGHTS.get(category, 4)
    
    # Keyword urgency score
    keyword_score = 0
    matched_keywords = []
    for token in tokens:
        if token in URGENCY_KEYWORDS:
            keyword_score += URGENCY_KEYWORDS[token]
            matched_keywords.append(token)
    
    # Normalize components
    keyword_norm = min(keyword_score / 15, 1.0)  # Cap at 15 points
    severity_norm = severity / 10
    upvote_norm = min(upvotes / 50, 1.0)
    age_norm = min(age_days / 30, 1.0)
    
    # Weighted combination
    score = (
        keyword_norm * 0.35 +
        severity_norm * 0.30 +
        upvote_norm * 0.20 +
        age_norm * 0.15
    )
    
    # Classify
    if score >= 0.7:
        level = "critical"
    elif score >= 0.5:
        level = "high"
    elif score >= 0.3:
        level = "medium"
    else:
        level = "low"
    
    return {
        "score": round(score, 3),
        "level": level,
        "severity_weight": severity,
        "keyword_matches": matched_keywords,
        "factors": {
            "keyword_urgency": round(keyword_norm, 3),
            "category_severity": round(severity_norm, 3),
            "community_votes": round(upvote_norm, 3),
            "age_factor": round(age_norm, 3),
        }
    }


def classify_issue(description: str) -> Dict:
    """
    Auto-classify issue category from description text.
    Uses keyword matching with weighted categories.
    """
    category_keywords = {
        "pothole": ["pothole", "road", "crack", "pavement", "asphalt", "hole", "bump", "street", "surface"],
        "streetlight": ["light", "lamp", "dark", "bulb", "pole", "street light", "dim", "flickering", "glow", "night"],
        "garbage": ["garbage", "trash", "waste", "dump", "litter", "bin", "rubbish", "debris", "smell", "pile"],
        "water_leakage": ["water", "leak", "pipe", "burst", "flood", "drain", "sewage", "plumbing", "tap", "wet"],
        "other": ["noise", "graffiti", "construction", "stray", "encroachment"],
    }
    
    tokens = set(tokenize(description))
    scores = {}
    
    for category, keywords in category_keywords.items():
        match_count = sum(1 for kw in keywords if kw in tokens or any(kw in t for t in tokens))
        scores[category] = match_count
    
    # Sort by score
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    best_category = ranked[0][0] if ranked[0][1] > 0 else "other"
    
    return {
        "predicted_category": best_category,
        "confidence": round(min(ranked[0][1] / 3, 1.0), 2) if ranked[0][1] > 0 else 0.1,
        "all_scores": {k: v for k, v in ranked if v > 0},
    }


def cosine_similarity(vec_a: Dict[str, float], vec_b: Dict[str, float]) -> float:
    """Compute cosine similarity between two term-frequency vectors."""
    all_keys = set(vec_a.keys()) | set(vec_b.keys())
    dot = sum(vec_a.get(k, 0) * vec_b.get(k, 0) for k in all_keys)
    mag_a = math.sqrt(sum(v ** 2 for v in vec_a.values()))
    mag_b = math.sqrt(sum(v ** 2 for v in vec_b.values()))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)


def text_to_tf(text: str) -> Dict[str, float]:
    """Convert text to term-frequency vector."""
    tokens = tokenize(text)
    counts = Counter(tokens)
    total = len(tokens) or 1
    return {word: count / total for word, count in counts.items()}


def find_duplicates(
    new_text: str,
    new_category: str,
    existing_issues: List[Dict],
    threshold: float = 0.4,
    new_lat: float = None,
    new_lng: float = None,
    radius_meters: float = 500,
) -> List[Dict]:
    """
    Find potential duplicate issues using text similarity + geo proximity.
    Returns list of similar issues with similarity scores.
    """
    new_tf = text_to_tf(new_text)
    duplicates = []
    
    for issue in existing_issues:
        # Category match bonus
        cat_bonus = 0.15 if issue.get("category") == new_category else 0
        
        # Text similarity
        issue_text = f"{issue.get('title', '')} {issue.get('description', '')}"
        issue_tf = text_to_tf(issue_text)
        text_sim = cosine_similarity(new_tf, issue_tf)
        
        # Geo proximity bonus
        geo_bonus = 0
        if new_lat and new_lng and issue.get("latitude") and issue.get("longitude"):
            dist = haversine_distance(new_lat, new_lng, issue["latitude"], issue["longitude"])
            if dist < radius_meters:
                geo_bonus = 0.2 * (1 - dist / radius_meters)
        
        total_sim = min(text_sim + cat_bonus + geo_bonus, 1.0)
        
        if total_sim >= threshold:
            duplicates.append({
                "issue_id": issue.get("id"),
                "title": issue.get("title"),
                "similarity": round(total_sim, 3),
                "text_similarity": round(text_sim, 3),
                "geo_proximity": round(geo_bonus, 3),
                "category_match": cat_bonus > 0,
            })
    
    return sorted(duplicates, key=lambda x: x["similarity"], reverse=True)[:5]


def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Great-circle distance in meters."""
    R = 6_371_000
    to_rad = lambda d: d * math.pi / 180
    dlat = to_rad(lat2 - lat1)
    dlng = to_rad(lng2 - lng1)
    a = math.sin(dlat/2)**2 + math.cos(to_rad(lat1)) * math.cos(to_rad(lat2)) * math.sin(dlng/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))


def cluster_issues(issues: List[Dict], cell_size_meters: float = 500) -> List[Dict]:
    """Grid-based spatial clustering of issues."""
    lat_deg = cell_size_meters / 111_320
    lng_deg = cell_size_meters / 78_710
    
    buckets: Dict[str, List[Dict]] = {}
    
    for issue in issues:
        lat = issue.get("latitude")
        lng = issue.get("longitude")
        if lat is None or lng is None:
            continue
        cell_x = math.floor(lat / lat_deg)
        cell_y = math.floor(lng / lng_deg)
        key = f"{cell_x}:{cell_y}"
        buckets.setdefault(key, []).append(issue)
    
    clusters = []
    for key, items in buckets.items():
        avg_lat = sum(i.get("latitude", 0) for i in items) / len(items)
        avg_lng = sum(i.get("longitude", 0) for i in items) / len(items)
        
        # Dominant category
        cats = Counter(i.get("category", "other") for i in items)
        dominant = cats.most_common(1)[0][0]
        
        clusters.append({
            "cluster_id": key,
            "center": {"lat": round(avg_lat, 6), "lng": round(avg_lng, 6)},
            "issue_count": len(items),
            "dominant_category": dominant,
            "issue_ids": [i.get("id") for i in items],
            "is_hotspot": len(items) >= 3,
        })
    
    return sorted(clusters, key=lambda x: x["issue_count"], reverse=True)
