import { useEffect, useState } from "react";

import type { Profile } from "../types/profiles";
import { loadProfiles } from "../lib/loadProfiles";

export interface UseProfilesResult {
  status: "loading" | "error" | "ready";
  profiles: Profile[];
  error: string | null;
  /** True while a manual reload() is in flight (data stays visible meanwhile). */
  isRefreshing: boolean;
  reload: () => void;
}

/**
 * Loads profiles from the published Google Sheet CSV.
 *
 * Uses stale-while-revalidate: once data has loaded, calling reload() keeps the
 * current profiles on screen and only flips `isRefreshing`, so the FETCH button
 * can refresh in place without a full-screen flash.
 */
export function useProfiles(): UseProfilesResult {
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;

    loadProfiles()
      .then((loaded) => {
        if (cancelled) return;
        setProfiles(loaded);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setIsRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const reload = () => {
    setIsRefreshing(true);
    setNonce((n) => n + 1);
  };

  const status: UseProfilesResult["status"] =
    profiles !== null ? "ready" : error !== null ? "error" : "loading";

  return { status, profiles: profiles ?? [], error, isRefreshing, reload };
}
