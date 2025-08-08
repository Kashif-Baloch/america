"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import kyInstance from "./ky";

export type Testimonial = {
    id: string;
    name: string;
    country: string;
    flag: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    text: Record<string, string | undefined>;
};

export async function fetchTestimonials(): Promise<Testimonial[]> {
    return kyInstance.get("/api/testimonials").json<Testimonial[]>();
}

// centralize keys so you can extend later
export const testimonialsKeys = {
    all: () => ["testimonials"] as const,
};

// Defaults for THIS query only (5 min fresh; 10 min GC)
export const TESTIMONIALS_STALE_TIME = 5 * 60 * 1000;
export const TESTIMONIALS_GC_TIME = 10 * 60 * 1000;

export function useTestimonialsQuery(
    options?: Omit<
        UseQueryOptions<Testimonial[], Error, Testimonial[]>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery({
        queryKey: testimonialsKeys.all(),
        queryFn: fetchTestimonials,
        staleTime: TESTIMONIALS_STALE_TIME,
        gcTime: TESTIMONIALS_GC_TIME,
        refetchOnWindowFocus: false,
        ...options,
    });
}
