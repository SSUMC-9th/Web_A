const V4 = import.meta.env.VITE_TMDB_V4_TOKEN as string;
const BASE = "https://api.themoviedb.org/3";

/** 이미지 URL 헬퍼 */
export const tmdbImg = (
  path: string | null | undefined,
  size: "w500" | "w780" | "original" = "w500"
) => (path ? `https://image.tmdb.org/t/p/${size}${path}` : "");

/** 공통 요청(fetch, v4 Bearer 권장) */
async function request<T>(path: string, params: Record<string, string | number | boolean> = {}) {
  const url = new URL(BASE + path);
  const defaults = { language: "ko-KR", region: "KR" };
  Object.entries({ ...defaults, ...params }).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${V4}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`TMDB ${res.status}: ${msg}`);
  }
  return (await res.json()) as T;
}

/** 타입(필요한 필드만) */
export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
};

/** 예시: 트렌딩 or 인기 영화 */
export function fetchPopular(page = 1) {
  return request<{ page: number; results: Movie[]; total_pages: number }>("/movie/popular", { page });
}
export function fetchTrending(timeWindow: "day" | "week" = "day") {
  return request<{ results: Movie[] }>(`/trending/movie/${timeWindow}`);
}
