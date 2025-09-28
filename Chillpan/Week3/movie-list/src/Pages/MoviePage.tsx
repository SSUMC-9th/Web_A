import { useEffect, useState } from "react";
import axios from "axios";
import type { Movie } from "../types/movie";
import MovieCards from "../components/MovieCards";

export default function MoviePage() {
  // 영화 목록 데이터를 저장.
  const [movies, setMovies] = useState<Movie[]>([]);
  //console.log(movies);

  useEffect((): void => {
    // 비동기 함수로 영화 데이터를 가져옴
    const fetchMovies = async (): Promise<void> => {
      const { data } = await axios(
        "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1",
        {
          headers: {
            // 환경변수에서 API 키 가져와서 인증 헤더에 추가
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        }
      );

      // API 응답의 results 배열을 movies 상태에 저장
      setMovies(data.results); // API 받아온 후 실행
    };

    fetchMovies();
  }, []); //두번째 인자 빈 배열 -> 컴포넌트가 마운트될 때 딱 한번만 실행된다.

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {/* movies 배열을 순회하며 각 영화를 MovieCards 컴포넌트로 렌더링 */}
        {movies.map((movie) => (
          <MovieCards key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
