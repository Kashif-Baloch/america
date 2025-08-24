"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import ky from "./ky";
import { ApiResponse, SubscriptionMe } from "./types";

export const subscriptionKeys = {
  me: () => ["subscription", "me"] as const,
};

export async function fetchSubscriptionMe(): Promise<SubscriptionMe> {
  const res = await ky.get("/api/subscription/me").json<ApiResponse<SubscriptionMe>>();
  if (!res.success || !res.data) throw new Error(res.message || "Failed to fetch subscription");
  return res.data;
}

export function useSubscriptionPlan(
  options?: Omit<UseQueryOptions<SubscriptionMe, Error, SubscriptionMe>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: subscriptionKeys.me(),
    queryFn: fetchSubscriptionMe,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
}
