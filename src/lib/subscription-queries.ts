"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import ky from "./ky";
import {
  ApiResponse,
  SubscriptionMe,
  SubscriptionWithConsultations,
} from "./types";

export const subscriptionKeys = {
  me: () => ["subscription", "me"] as const,
  meDetails: () => ["subscription-details"] as const,
};

export async function fetchSubscriptionMe(): Promise<SubscriptionMe> {
  const res = await ky
    .get("/api/subscription/me")
    .json<ApiResponse<SubscriptionMe>>();
  if (!res.success || !res.data)
    throw new Error(res.message || "Failed to fetch subscription");
  return res.data;
}

export function useSubscriptionPlan(
  options?: Omit<
    UseQueryOptions<SubscriptionMe, Error, SubscriptionMe>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: subscriptionKeys.me(),
    queryFn: fetchSubscriptionMe,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export async function fetchSubscriptionMeDetails(): Promise<SubscriptionWithConsultations> {
  const res = await ky
    .get("/api/subscription/me/details")
    .json<ApiResponse<SubscriptionWithConsultations>>();

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to fetch subscription details");
  }

  return res.data;
}

export function useSubscriptionMeDetails(
  options?: Omit<
    UseQueryOptions<
      SubscriptionWithConsultations,
      Error,
      SubscriptionWithConsultations
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: subscriptionKeys.meDetails(),
    queryFn: fetchSubscriptionMeDetails,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
}
