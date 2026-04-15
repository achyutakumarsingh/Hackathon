/**
 * Civic Sense — ML API Service
 * Connects frontend to the Python ML backend.
 */

const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'https://civic-sense-api.onrender.com';

interface PriorityPrediction {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  severity_weight: number;
  keyword_matches: string[];
  factors: {
    keyword_urgency: number;
    category_severity: number;
    community_votes: number;
    age_factor: number;
  };
}

interface ClassificationResult {
  predicted_category: string;
  confidence: number;
  all_scores: Record<string, number>;
}

interface DuplicateResult {
  issue_id: string;
  title: string;
  similarity: number;
  text_similarity: number;
  geo_proximity: number;
  category_match: boolean;
}

interface ClusterResult {
  cluster_id: string;
  center: { lat: number; lng: number };
  issue_count: number;
  dominant_category: string;
  issue_ids: string[];
  is_hotspot: boolean;
}

interface AnalyticsResult {
  total_issues: number;
  by_status: Record<string, number>;
  by_category: Record<string, number>;
  avg_resolution_days: number;
  hotspot_count: number;
}

async function mlFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${ML_API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  
  if (!res.ok) {
    const errText = await res.text().catch(() => 'Unknown error');
    throw new Error(`ML API error (${res.status}): ${errText}`);
  }
  
  return res.json();
}

export const MLService = {
  /**
   * Predict issue priority using NLP analysis
   */
  async predictPriority(
    description: string,
    category: string,
    upvotes = 0,
    ageDays = 0,
  ): Promise<PriorityPrediction> {
    const data = await mlFetch<{ prediction: PriorityPrediction }>(
      '/api/ml/predict-priority',
      {
        method: 'POST',
        body: JSON.stringify({
          description,
          category,
          upvotes,
          age_days: ageDays,
        }),
      },
    );
    return data.prediction;
  },

  /**
   * Auto-classify issue category from description
   */
  async classifyIssue(description: string): Promise<ClassificationResult> {
    const data = await mlFetch<{ classification: ClassificationResult }>(
      '/api/ml/classify',
      {
        method: 'POST',
        body: JSON.stringify({ description }),
      },
    );
    return data.classification;
  },

  /**
   * Find potential duplicate issues
   */
  async findDuplicates(
    description: string,
    category: string,
    latitude?: number,
    longitude?: number,
  ): Promise<{ duplicates: DuplicateResult[]; duplicates_found: number }> {
    const data = await mlFetch<{ duplicates: DuplicateResult[]; duplicates_found: number }>(
      '/api/ml/duplicates',
      {
        method: 'POST',
        body: JSON.stringify({
          description,
          category,
          latitude,
          longitude,
          threshold: 0.3,
        }),
      },
    );
    return data;
  },

  /**
   * Get geo-clusters and hotspot data
   */
  async getClusters(cellSizeMeters = 500): Promise<{
    clusters: ClusterResult[];
    hotspots: ClusterResult[];
    hotspot_count: number;
  }> {
    const data = await mlFetch<{
      clusters: ClusterResult[];
      hotspots: ClusterResult[];
      hotspot_count: number;
    }>('/api/ml/clusters', {
      method: 'POST',
      body: JSON.stringify({ cell_size_meters: cellSizeMeters }),
    });
    return data;
  },

  /**
   * Get analytics dashboard data
   */
  async getAnalytics(): Promise<AnalyticsResult> {
    return mlFetch<AnalyticsResult>('/api/ml/analytics');
  },

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await mlFetch('/health');
      return true;
    } catch {
      return false;
    }
  },
};
