"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useConditions() {
  const { data, error, mutate } = useSWR("/api/conditions", fetcher, {
    refreshInterval: 0, // manual revalidation after mutations
  });

  return {
    conditions: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
