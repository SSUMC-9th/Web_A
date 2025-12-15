import { useCallback, useMemo, useState } from "react";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import useFetch from "../hooks/useFetch";
import { type Movie, type MovieFilters, type MovieResponse } from "../types/movie";
import MovieDetailModal from "../components/MovieDetailModal";


export default function HomePage () {
    const [filters, setFilters] = useState<MovieFilters>({
        query: "어벤져스",
        include_adult: false,
        language: "ko-KR"
    });

    const [selectedMovie, setSelectedMovie ] = useState<Movie | null>(null);

    const axiosRequestConfig = useMemo(
        () => ({
            params: filters,
        }), [filters]);
    
    const { data, error, isLoading } = useFetch<MovieResponse>(
        "/search/movie",
        axiosRequestConfig,
    );

    // useCallback으로 감싸면
    // 참조값이 고정된 stable한 reference 함수가 됨
    // 따라서 deps(setFIlters)가 변경되지 않는 한 같은 함수로 유지가 됨
    // const handleMovieFilters = useCallback(
    //     (filters: MovieFilters) => {
    //         setFilters(filters);
    //     },
    //     [setFilters],
    // );
    const handleMovieFilters = useCallback((next: MovieFilters) => {
        setFilters(next);
    }, []);

    const handleOpenModal = useCallback((movie: Movie)=> {
        setSelectedMovie(movie);
    }, []);

    const handleCloseModal = useCallback((): void => {
        setSelectedMovie(null);
    }, []);

    const movies = useMemo(() => data?.results ?? [], [data]);


    if (error) {
        return <div>{error}</div>
    }

    return (
        <div className="container">
            <MovieFilter onChange={handleMovieFilters} />

            { isLoading ? (
                <div>로딩 중 입니다...</div>
            ) : (
                <MovieList
                    movies={movies}
                    onMovieClick={handleOpenModal}
                />
            )}

            {selectedMovie && (
                <MovieDetailModal
                    open={!!selectedMovie}
                    movie={selectedMovie}
                    onClose={handleCloseModal}
                />
            )}
            
        </div>
    )
}
