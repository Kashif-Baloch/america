"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import kyInstance from "./ky";
import { ApiResponse, JobWithTranslations } from "./types";

export const jobsKeys = {
    all: () => ["jobs"] as const,
};

export const JOBS_STALE_TIME = 5 * 60 * 1000; // 5 min fresh
export const JOBS_GC_TIME = 10 * 60 * 1000;   // optional: keep cache around longer

export async function fetchJobs(): Promise<JobWithTranslations[]> {
    const res = await kyInstance.get("/api/jobs").json<ApiResponse<JobWithTranslations[]>>();
    if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to fetch jobs");
    }
    return res.data;
}

export function useJobsQuery(
    options?: Omit<
        UseQueryOptions<JobWithTranslations[], Error, JobWithTranslations[]>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery({
        queryKey: jobsKeys.all(),
        queryFn: fetchJobs,
        staleTime: JOBS_STALE_TIME,
        gcTime: JOBS_GC_TIME,
        refetchOnWindowFocus: false,
        ...options,
    });
}
