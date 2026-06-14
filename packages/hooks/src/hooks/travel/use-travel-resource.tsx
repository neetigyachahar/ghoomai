"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { TravelResource, TravelResourceType } from "@repo/types";

export interface TravelDataContextValue {
  apiBase: string;
}

export const TravelDataContext = createContext<TravelDataContextValue | null>(
  null,
);

export interface TravelDataProviderProps {
  apiBase?: string;
  children: ReactNode;
}

export function TravelDataProvider({
  apiBase = "",
  children,
}: TravelDataProviderProps) {
  const value = useMemo(() => ({ apiBase }), [apiBase]);

  return (
    <TravelDataContext.Provider value={value}>
      {children}
    </TravelDataContext.Provider>
  );
}

export function useTravelDataContext() {
  const context = useContext(TravelDataContext);

  if (!context) {
    throw new Error("useTravelResource must be used within TravelDataProvider");
  }

  return context;
}

export interface UseTravelResourceResult {
  data: TravelResource | null;
  isLoading: boolean;
  error: string | null;
}

export function useTravelResource(
  resourceType: TravelResourceType,
  resourceId: string,
): UseTravelResourceResult {
  const { apiBase } = useTravelDataContext();
  const [data, setData] = useState<TravelResource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadResource() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${apiBase}/api/travel/resource/${resourceType}/${resourceId}`,
        );

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(body?.error ?? `Request failed (${response.status})`);
        }

        const resource = (await response.json()) as TravelResource;

        if (!cancelled) {
          setData(resource);
        }
      } catch (err) {
        if (!cancelled) {
          setData(null);
          setError(err instanceof Error ? err.message : "Failed to load offer");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadResource();

    return () => {
      cancelled = true;
    };
  }, [apiBase, resourceId, resourceType]);

  return { data, isLoading, error };
}
