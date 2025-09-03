import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";

export interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: string;
  searchCount: number;
  startedAt: string | null;
  endsAt: string | null;
  daysLeft: number | null;
  durationMonths: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useSubscription = () => {
  const { data: session } = useSession();

  return useQuery<Subscription | null>({
    queryKey: ['subscription', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const response = await fetch('/api/subscription');
      if (!response.ok) {
        throw new Error('Failed to fetch subscription data');
      }
      
      const { data } = await response.json();
      return data;
    },
    enabled: !!session?.user?.id,
  });
};
