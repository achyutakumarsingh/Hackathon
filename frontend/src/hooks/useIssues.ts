import { useState, useCallback } from 'react';
import { IssueService } from '../services/issues';

let globalIssuesCache: any[] | null = null;
let _globalFetchPromise: Promise<any[]> | null = null;

// Clean lightweight global cache logic mimicking useSWR / React Query
export function useIssuesFeed() {
  const [issues, setIssues] = useState<any[]>(globalIssuesCache || []);
  const [loading, setLoading] = useState<boolean>(!globalIssuesCache);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async (force = false) => {
    if (!force && globalIssuesCache) {
      setIssues(globalIssuesCache);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (!_globalFetchPromise || force) {
        _globalFetchPromise = IssueService.getIssuesFeed(20);
      }
      
      const data = await _globalFetchPromise;
      globalIssuesCache = data || [];
      setIssues(globalIssuesCache);
      
    } catch (err: any) {
      console.error("[useIssuesFeed hook]", err);
      setError(err.message || "Failed to sync telemetry log");
    } finally {
      setLoading(false);
      _globalFetchPromise = null;
    }
  }, []);

  return { issues, loading, error, refetch: () => fetchFeed(true), fetchFeed };
}
