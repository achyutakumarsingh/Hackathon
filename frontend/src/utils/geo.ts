// =============================================================================
// Civic Sense — Geospatial Utility Layer
// Pure functions: no dependencies, no side effects, fully testable.
// =============================================================================

/** Severity weights by issue category (used in priority calculation) */
const SEVERITY_WEIGHTS: Record<string, number> = {
  pothole: 8,
  water: 9,
  streetlight: 6,
  garbage: 5,
  other: 4,
};

// ---------------------------------------------------------------------------
// 1. Haversine Distance
// ---------------------------------------------------------------------------

/**
 * Returns the great-circle distance between two GPS points in **meters**.
 */
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6_371_000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---------------------------------------------------------------------------
// 2. Find Nearby Issues
// ---------------------------------------------------------------------------

export interface IssueGeo {
  id: string;
  lat: number;
  lng: number;
  category?: string;
  title?: string;
  status?: string;
  upvote_count?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

/**
 * Returns issues within `radiusMeters` of a given point.
 * Optionally filters to the same `category`.
 */
export function findNearbyIssues(
  issues: IssueGeo[],
  lat: number,
  lng: number,
  radiusMeters = 200,
  category?: string,
): (IssueGeo & { distance: number })[] {
  return issues
    .map((issue) => ({
      ...issue,
      distance: haversineDistance(lat, lng, issue.lat, issue.lng),
    }))
    .filter((i) => {
      if (i.distance > radiusMeters) return false;
      if (category && i.category !== category) return false;
      return true;
    })
    .sort((a, b) => a.distance - b.distance);
}

// ---------------------------------------------------------------------------
// 3. Cluster Issues (grid-based spatial hashing)
// ---------------------------------------------------------------------------

export interface IssueCluster {
  id: string;
  lat: number;
  lng: number;
  issues: IssueGeo[];
  dominantCategory: string;
  count: number;
}

/**
 * Groups issues into clusters using a simple equirectangular grid.
 * `cellSizeMeters` controls how close issues must be to share a cell.
 */
export function clusterIssues(
  issues: IssueGeo[],
  cellSizeMeters = 500,
): IssueCluster[] {
  // Approximate degrees per meter at mid-latitudes
  const latDeg = cellSizeMeters / 111_320;
  const lngDeg = cellSizeMeters / 78_710; // ~cos(45°)

  const buckets: Record<string, IssueGeo[]> = {};

  for (const issue of issues) {
    if (issue.lat == null || issue.lng == null) continue;
    const cellX = Math.floor(issue.lat / latDeg);
    const cellY = Math.floor(issue.lng / lngDeg);
    const key = `${cellX}:${cellY}`;
    (buckets[key] ??= []).push(issue);
  }

  return Object.entries(buckets).map(([key, items]) => {
    // Cluster centroid = average of member coords
    const avgLat = items.reduce((s, i) => s + i.lat, 0) / items.length;
    const avgLng = items.reduce((s, i) => s + i.lng, 0) / items.length;

    // Dominant category = most frequent
    const freq: Record<string, number> = {};
    for (const i of items) {
      const cat = i.category || 'other';
      freq[cat] = (freq[cat] || 0) + 1;
    }
    const dominantCategory = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];

    return {
      id: key,
      lat: avgLat,
      lng: avgLng,
      issues: items,
      dominantCategory,
      count: items.length,
    };
  });
}

// ---------------------------------------------------------------------------
// 4. Priority Scoring
// ---------------------------------------------------------------------------

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface PriorityResult {
  score: number;
  level: PriorityLevel;
}

/**
 * Computes a priority score and level for an issue.
 *
 * Formula:
 *   score = (upvotes × 2) + ageDays + severityWeight
 *
 * Thresholds:
 *   ≥ 20 → High
 *   ≥ 10 → Medium
 *   else → Low
 */
export function calculatePriority(issue: IssueGeo): PriorityResult {
  const upvotes = issue.upvote_count || 0;
  const severity = SEVERITY_WEIGHTS[issue.category || 'other'] || 4;

  let ageDays = 0;
  if (issue.created_at) {
    ageDays = Math.max(
      0,
      Math.floor(
        (Date.now() - new Date(issue.created_at).getTime()) / 86_400_000,
      ),
    );
  }

  const score = upvotes * 2 + ageDays + severity;

  let level: PriorityLevel = 'low';
  if (score >= 20) level = 'high';
  else if (score >= 10) level = 'medium';

  return { score, level };
}

// ---------------------------------------------------------------------------
// 5. Municipal Zone Mapping
// ---------------------------------------------------------------------------

/** Simple grid-based zone assignment. */
const ZONE_NAMES = [
  ['North-West Ward', 'North Ward', 'North-East Ward'],
  ['West Ward', 'Central Ward', 'East Ward'],
  ['South-West Ward', 'South Ward', 'South-East Ward'],
] as const;

const ZONE_AUTHORITIES: Record<string, string> = {
  'North-West Ward': 'Zone-NW Municipal Office',
  'North Ward': 'Zone-N Municipal Office',
  'North-East Ward': 'Zone-NE Municipal Office',
  'West Ward': 'Zone-W Municipal Office',
  'Central Ward': 'Central Municipal Office',
  'East Ward': 'Zone-E Municipal Office',
  'South-West Ward': 'Zone-SW Municipal Office',
  'South Ward': 'Zone-S Municipal Office',
  'South-East Ward': 'Zone-SE Municipal Office',
};

export interface ZoneInfo {
  name: string;
  authority: string;
}

/**
 * Maps a lat/lng to a named zone using a 3×3 grid over the city bounds.
 * For production, replace with real ward boundary GeoJSON lookups.
 */
export function getZone(lat: number, lng: number): ZoneInfo {
  // Normalize to 0-1 range based on rough city bounds
  // This creates a relative grid that works for any city
  const latNorm = ((lat % 1) + 1) % 1; // fractional part, always 0–1
  const lngNorm = ((lng % 1) + 1) % 1;

  const row = Math.min(2, Math.floor(latNorm * 3));
  const col = Math.min(2, Math.floor(lngNorm * 3));

  // Invert row so higher lat = "North"
  const name = ZONE_NAMES[2 - row][col];
  return {
    name,
    authority: ZONE_AUTHORITIES[name],
  };
}
