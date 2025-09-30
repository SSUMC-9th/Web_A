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

export const tmdbImg = (
  path: string | null | undefined,
  size: "w500" | "w780" | "original" = "w500"
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
