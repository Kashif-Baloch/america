"use client";

import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import kyInstance from "./ky";
import { ApiResponse, JobWithTranslations } from "./types";

export const jobsKeys = {
    all: () => ["jobs"] as const,
    public: {
        all: () => ["jobs", "public"] as const,
    },
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

// --- Public (no auth; hits /api/jobs/public) ---
export async function fetchPublicJobs(): Promise<JobWithTranslations[]> {
    const res = await kyInstance.get("/api/jobs/public").json<ApiResponse<JobWithTranslations[]>>();
    if (!res.success || !res.data) throw new Error(res.message || "Failed to fetch public jobs");
    return res.data;
}

export function usePublicJobsQuery(
    options?: Omit<
        UseQueryOptions<JobWithTranslations[], Error, JobWithTranslations[]>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery({
        queryKey: jobsKeys.public.all(),
        queryFn: fetchPublicJobs,
        staleTime: JOBS_STALE_TIME,
        gcTime: JOBS_GC_TIME,
        refetchOnWindowFocus: false,
        ...options,
    });
}

export function useDeleteJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (jobId: string) => {
            const res = await kyInstance
                .delete(`/api/jobs/${jobId}`)
                .json<{ success: boolean; message: string }>();

            if (!res.success) {
                throw new Error(res.message || "Failed to delete job");
            }
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: jobsKeys.all() });
        },
    });
}