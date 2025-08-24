import { Job, JobTranslation, JobDetail } from "@prisma/client";

// Base job type with all fields as strings for API responses
type ApiJob = Omit<Job, 'createdAt' | 'updatedAt' | 'translations' | 'detail'> & {
  createdAt: string;
  updatedAt: string;
  translations: JobTranslation[];
  detail?: JobDetail | null;
};

export interface JobWithDetails extends Job {
  translations: JobTranslation[];
  detail?: JobDetail | null;
}

export interface FavoriteJob {
  id: string;
  jobId: string;
  userId: string;
  job: JobWithDetails;
  createdAt: Date;
  updatedAt: Date;
}

// Type for the API response
interface ApiFavoriteJob extends Omit<FavoriteJob, 'job' | 'createdAt' | 'updatedAt'> {
  job: ApiJob;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success?: boolean;
}

export async function getFavorites(): Promise<FavoriteJob[]> {
  try {
    const response = await fetch('/api/favorites');
    
    if (!response.ok) {
      const errorData: ApiResponse<never> = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch favorites');
    }
    
    const apiFavorites: ApiFavoriteJob[] = await response.json();
    
    // Convert API response to properly typed FavoriteJob objects
    return apiFavorites.map(fav => ({
      ...fav,
      createdAt: new Date(fav.createdAt),
      updatedAt: new Date(fav.updatedAt),
      job: {
        ...fav.job,
        createdAt: new Date(fav.job.createdAt),
        updatedAt: new Date(fav.job.updatedAt),
        translations: fav.job.translations || [],
        detail: fav.job.detail || null,
      }
    }));
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

export interface AddToFavoritesResponse {
  success: boolean;
  error?: string;
  favorite?: FavoriteJob;
  requiresUpgrade?: boolean;
}

export async function addToFavorites(jobId: string): Promise<AddToFavoritesResponse> {
  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobId }),
    });
    
    if (!response.ok) {
      const errorData: ApiResponse<never> = await response.json().catch(() => ({}));
      // Handle subscription limit error specifically
      if (response.status === 403) {
        return {
          success: false,
          error: errorData.error || 'Subscription limit reached',
          requiresUpgrade: true
        };
      }
      return {
        success: false,
        error: errorData.error || 'Failed to add favorite'
      };
    }
    
    const apiFavorite: ApiFavoriteJob = await response.json();
    
    // Convert API response to properly typed FavoriteJob
    const favorite: FavoriteJob = {
      ...apiFavorite,
      createdAt: new Date(apiFavorite.createdAt),
      updatedAt: new Date(apiFavorite.updatedAt),
      job: {
        ...apiFavorite.job,
        createdAt: new Date(apiFavorite.job.createdAt),
        updatedAt: new Date(apiFavorite.job.updatedAt),
        translations: apiFavorite.job.translations || [],
        detail: apiFavorite.job.detail || null,
      }
    };
    
    return { success: true, favorite };
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

export interface RemoveFromFavoritesResponse {
  success: boolean;
  error?: string;
  jobId?: string;
  job?: JobWithDetails;
}

export async function removeFromFavorites(jobId: string): Promise<RemoveFromFavoritesResponse> {
  try {
    const response = await fetch(`/api/favorites?jobId=${encodeURIComponent(jobId)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData: ApiResponse<never> = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || 'Failed to remove favorite'
      };
    }
    
    const result: { success: boolean; jobId: string; job?: ApiJob } = await response.json();
    
    if (!result.job) {
      return { 
        success: result.success, 
        jobId: result.jobId
      };
    }
    
    return { 
      success: result.success, 
      jobId: result.jobId,
      job: {
        ...result.job,
        createdAt: new Date(result.job.createdAt),
        updatedAt: new Date(result.job.updatedAt),
        translations: result.job.translations || [],
        detail: result.job.detail || null,
      }
    };
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

export async function isFavorite(jobId: string): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    return favorites.some(fav => fav.jobId === jobId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
}
