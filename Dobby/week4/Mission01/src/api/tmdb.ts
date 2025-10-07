// --- 기존 그대로 ---
const V4 = import.meta.env.VITE_TMDB_V4_TOKEN as string;
const BASE = "https://api.themoviedb.org/3";

export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average?: number;
  release_date?: string;
};

// 이미지 사이즈에 w1280 추가 (백드롭용)
export const tmdbImg = (
  path: string | null | undefined, 
  size:
   | "w92" | "w154" | "w185" | "w342"   // ✅ 인물/작은 썸네일용 사이즈 추가
   | "w500" | "w780" | "w1280" | "original" = "w500"
  ) => (path ? `https://image.tmdb.org/t/p/${size}${path}` : "");

async function request<T>(path: string, params: Record<string, string | number> = {}) {
  const url = new URL(BASE + path);
  const defaults = { language: "ko-KR", region: "KR" };
  Object.entries({ ...defaults, ...params }).forEach(([k, v]) =>
    url.searchParams.set(k, String(v))
  );

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${V4}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return (await res.json()) as T;
}

export function fetchByCategory(
  category: "popular" | "now_playing" | "top_rated" | "upcoming",
  page = 1
) {
  return request<{ page: number; results: Movie[]; total_pages: number }>(
    `/movie/${category}`,
    { page }
  );
}

// --- ⬇️ 여기부터 추가: 상세/크레딧 타입 & API --- //

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  tagline: string;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: { id: number; name: string }[];
}

export interface Credits {
  cast: Array<{
    id: number;
    name: string;
    character?: string;
    profile_path: string | null;
    order?: number;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job?: string;
    department?: string;
    profile_path: string | null;
  }>;
}

/** 상세 정보 */
export function fetchMovieDetails(id: number) {
  return request<MovieDetails>(`/movie/${id}`);
}

/** 출연/제작진 */
export function fetchMovieCredits(id: number) {
  return request<Credits>(`/movie/${id}/credits`);
}
