"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import kyInstance from "./ky";
import { ApiResponse, JobWithTranslations } from "./types";

export type PublicJobFilters = {
  q?: string; // job title query
  location?: string;
  jobType?: string[];
  hiresOutside?: string; // yes | no | sometimes
  season?: string[];
  transportationHousing?: string;
  salary?: string; // 'upto13' | 'upto26' | 'above26'
};

export const jobsKeys = {
  all: () => ["jobs"] as const,
  public: {
    all: () => ["jobs", "public"] as const,
  },
};

export const JOBS_STALE_TIME = 5 * 60 * 1000; // 5 min fresh
export const JOBS_GC_TIME = 10 * 60 * 1000; // optional: keep cache around longer

export async function fetchJobs(): Promise<JobWithTranslations[]> {
  const res = await kyInstance
    .get("/api/jobs")
    .json<ApiResponse<JobWithTranslations[]>>();
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
export async function fetchPublicJobs(
  filters?: PublicJobFilters
): Promise<JobWithTranslations[]> {
  const search = new URLSearchParams();
  if (filters?.q) search.set("q", filters.q);
  if (filters?.location) search.set("location", filters.location);
  filters?.jobType?.forEach((jt) => search.append("jobType", jt));
  if (filters?.hiresOutside) search.set("hiresOutside", filters.hiresOutside);
  filters?.season?.forEach((s) => search.append("season", s));
  if (filters?.transportationHousing)
    search.set("transportationHousing", filters.transportationHousing);
  if (filters?.salary) search.set("salary", filters.salary);

  const url = `/api/jobs/public${search.toString() ? `?${search.toString()}` : ""}`;
  const res = await kyInstance.get(url).json<ApiResponse<JobWithTranslations[]>>();
  // If backend signals quota reached, throw a specific error so UI can display feedback
  if (res.message && res.message.toLowerCase().includes("monthly search limit")) {
    throw new Error(res.message);
  }
  if (!res.success || !res.data)
    throw new Error(res.message || "Failed to fetch public jobs");
  return res.data;
}

export function usePublicJobsQuery(
  filters?: PublicJobFilters,
  options?: Omit<
    UseQueryOptions<JobWithTranslations[], Error, JobWithTranslations[]>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: [...jobsKeys.public.all(), filters ?? {}],
    queryFn: () => fetchPublicJobs(filters),
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
