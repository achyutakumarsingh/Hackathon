import { supabase } from '../lib/supabase';
import { findNearbyIssues, type IssueGeo } from '../utils/geo';

// =============================================================================
// Civic Sense — Issue Service Layer
// All Supabase queries are centralized here. Components never call DB directly.
// =============================================================================

const FEED_FIELDS = 'id, title, category, status, address, created_at, lat, lng, images, upvote_count';

export const IssueService = {

  // ── Feed ──────────────────────────────────────────────────────────────
  async getIssuesFeed(limit = 20) {
    const { data, error } = await supabase
      .from('issues')
      .select(FEED_FIELDS)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // ── Admin (no limit) ──────────────────────────────────────────────────
  async getAdminIssues() {
    const { data, error } = await supabase
      .from('issues')
      .select(FEED_FIELDS)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // ── Single Issue ──────────────────────────────────────────────────────
  async getIssueById(id: string) {
    const { data, error } = await supabase
      .from('issues')
      .select('*, profiles(email)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // ── Status Update ─────────────────────────────────────────────────────
  async updateIssueStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('issues')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return data;
  },

  // ── Upvote ────────────────────────────────────────────────────────────
  async incrementUpvote(id: string, currentCount: number) {
    const { error } = await supabase.rpc('increment_upvote', { row_id: id });
    if (error) {
      const { error: fallbackError } = await supabase
        .from('issues')
        .update({ upvote_count: currentCount + 1 })
        .eq('id', id);
      if (fallbackError) throw fallbackError;
    }
    return true;
  },

  // ── Create Issue ──────────────────────────────────────────────────────
  async createIssue(payload: any) {
    const { data, error } = await supabase
      .from('issues')
      .insert([payload]);

    if (error) throw error;
    return data;
  },

  // ── Nearby / Duplicate Detection ──────────────────────────────────────
  /**
   * Fetches recent issues in the same category and filters to those
   * within `radiusMeters` of the given point. Used for duplicate detection.
   */
  async getNearbyIssues(
    lat: number,
    lng: number,
    category: string,
    radiusMeters = 200,
  ): Promise<(IssueGeo & { distance: number })[]> {
    // Fetch recent issues in same category (last 90 days)
    const since = new Date(Date.now() - 90 * 86_400_000).toISOString();

    const { data, error } = await supabase
      .from('issues')
      .select('id, title, category, status, lat, lng, upvote_count, created_at')
      .eq('category', category)
      .gte('created_at', since)
      .neq('status', 'resolved') // only active issues
      .limit(50);

    if (error) throw error;
    if (!data || data.length === 0) return [];

    return findNearbyIssues(data as IssueGeo[], lat, lng, radiusMeters, category);
  },
};
