import MovieList from "../components/MovieList";
import MovieFilter from "../components/MovieFilter";
import useFetch from "../hooks/useFetch";
import type { MoviesResponse } from "../types/movie";

export default function HomePage() {
    const { data, error, isloading } = useFetch<MoviesResponse>("/search/movie", {
        params: {
            query: "어벤져스",
            include_adult: false,
            language: "ko-KR",
        },
    });

    if (error) {
        return <div>{error}</div>
    }

    return <div className="container">
        <MovieFilter />
        {isloading ? (
            <div>로딩 중입니다...</div>
        ) : (
            <MovieList movies={data?.results || []} />
        )}
    </div>
}

// 검색 필터
// 영화 무비