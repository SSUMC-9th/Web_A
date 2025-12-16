export interface Movie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
}

export interface SearchParams {
  query: string;
  includeAdult: boolean;
  language: string;
}

export type LanguageOption = 'ko-KR' | 'en-US' | 'ja-JP';
