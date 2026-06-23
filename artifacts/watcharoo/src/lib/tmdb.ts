const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

export async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.statusText}`);
  }

  return response.json();
}

export const getImageUrl = (path: string | null | undefined, size: "w500" | "original" = "w500") => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: "movie" | "tv" | "person";
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
}

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchProvidersResponse {
  results: {
    [countryCode: string]: {
      link: string;
      flatrate?: WatchProvider[];
      rent?: WatchProvider[];
      buy?: WatchProvider[];
    };
  };
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export const api = {
  searchMulti: (query: string) => tmdbFetch<{ results: MediaItem[] }>("/search/multi", { query }),
  getTrending: () => tmdbFetch<{ results: MediaItem[] }>("/trending/all/week"),
  getPopularMovies: () => tmdbFetch<{ results: MediaItem[] }>("/movie/popular"),
  getPopularTV: () => tmdbFetch<{ results: MediaItem[] }>("/tv/popular"),
  
  getMovie: (id: string) => tmdbFetch<any>(`/movie/${id}`),
  getTV: (id: string) => tmdbFetch<any>(`/tv/${id}`),
  
  getMovieProviders: (id: string) => tmdbFetch<WatchProvidersResponse>(`/movie/${id}/watch/providers`),
  getTVProviders: (id: string) => tmdbFetch<WatchProvidersResponse>(`/tv/${id}/watch/providers`),
  
  getMovieCredits: (id: string) => tmdbFetch<{ cast: CastMember[] }>(`/movie/${id}/credits`),
  getTVCredits: (id: string) => tmdbFetch<{ cast: CastMember[] }>(`/tv/${id}/credits`),
  
  getMovieVideos: (id: string) => tmdbFetch<{ results: Video[] }>(`/movie/${id}/videos`),
  getTVVideos: (id: string) => tmdbFetch<{ results: Video[] }>(`/tv/${id}/videos`),

  getSimilarMovies: (id: string) => tmdbFetch<{ results: MediaItem[] }>(`/movie/${id}/similar`),
  getSimilarTV: (id: string) => tmdbFetch<{ results: MediaItem[] }>(`/tv/${id}/similar`),
};