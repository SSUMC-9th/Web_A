// 영화 목록용 타입
type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
};

// 영화 상세 정보 타입 단, 실제 사용 필드만!
type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: Genre[];
};

// 장르 타입
type Genre = {
  id: number;
  name: string;
};

// 출연진 타입
type Cast = {
  id: number;
  name: string;
  profile_path: string | null;
};

// 제작진 타입
type Crew = {
  id: number;
  name: string;
  profile_path: string | null;
  job: string;
};

// 출연진/제작진
type Credits = {
  cast: Cast[];
  crew: Crew[];
};

export type { Movie, MovieDetail, Genre, Cast, Crew, Credits };
