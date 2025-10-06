import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { MovieDetails, Credits } from '../types/movie';
import LoadingSpinner from '../components/LoadingSpinner';

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const navigate = useNavigate();

    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [credits, setCredits] = useState<Credits | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!movieId) return;

        const fetchMovieData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // 영화 상세 정보와 출연진 정보를 병렬로 요청
                const [detailsResponse, creditsResponse] = await Promise.all([
                    axios.get<MovieDetails>(
                        `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
                        {
                            headers: {
                                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                            },
                        }
                    ),
                    axios.get<Credits>(
                        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
                        {
                            headers: {
                                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                            },
                        }
                    ),
                ]);

                setMovieDetails(detailsResponse.data);
                setCredits(creditsResponse.data);
            } catch (err) {
                console.error('영화 데이터를 불러오는 데 실패했습니다:', err);
                setError('영화 정보를 불러오는 데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieData();
    }, [movieId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !movieDetails) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
                <h1 className="text-2xl font-bold mb-4">😢 오류가 발생했습니다</h1>
                <p className="text-lg text-gray-300 mb-6">{error || '영화 정보를 찾을 수 없습니다.'}</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    홈으로 돌아가기
                </button>
            </div>
        );
    }

    //감독
    const director = credits?.crew.find(person => person.job === 'Director');

    //주요 출연진 10명만 출력
    const mainCast = credits?.cast.slice(0, 10) || [];

    //상영시간을 시간:분 형식으로 변환
    const formatRuntime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}시간 ${mins}분`;
    };



    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            {/* 뒤로가기 버튼 */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
                ← 뒤로가기
            </button>

            {/* 메인 정보 섹션 */}
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
                {/* 포스터 */}
                <div className="flex-shrink-0">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                        alt={movieDetails.title}
                        className="w-80 h-auto rounded-xl shadow-2xl"
                    />
                </div>

                {/* 영화 정보 */}
                <div className="flex-grow">
                    <h1 className="text-4xl font-bold mb-4">{movieDetails.title}</h1>

                    {/* 기본 정보 */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-400">⭐</span>
                            <span className="font-semibold">{movieDetails.vote_average.toFixed(1)}</span>
                            <span className="text-gray-400">({movieDetails.vote_count.toLocaleString()}명 평가)</span>
                        </div>
                        <div className="text-gray-300">
                            📅 {movieDetails.release_date}
                        </div>
                        <div className="text-gray-300">
                            ⏱️ {formatRuntime(movieDetails.runtime)}
                        </div>
                    </div>

                    {/* 장르 */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {movieDetails.genres.map(genre => (
                            <span
                                key={genre.id}
                                className="px-3 py-1 bg-blue-600 rounded-full text-sm"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>

                    {/* 줄거리 */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold mb-3">줄거리</h3>
                        <p className="text-lg leading-relaxed text-gray-300">
                            {movieDetails.overview || '줄거리 정보가 없습니다.'}
                        </p>
                    </div>

                    {/* 감독 정보 */}
                    {director && (
                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-2">감독/출연</h3>
                            <p className="text-lg text-gray-300">{director.name}</p>
                        </div>
                    )}


                </div>
            </div>

            {/* 출연진 섹션 */}
            {mainCast.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">감독/출연</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {mainCast.map(actor => (
                            <div key={actor.id} className="text-center">
                                <div className="mb-3">
                                    {actor.profile_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                            alt={actor.name}
                                            className="w-full h-48 object-cover rounded-lg shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-400">이미지 없음</span>
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-semibold text-sm mb-1">{actor.name}</h4>
                                <p className="text-xs text-gray-400">{actor.character}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 제작사 정보 */}
            {movieDetails.production_companies.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">제작사</h2>
                    <div className="flex flex-wrap gap-4">
                        {movieDetails.production_companies.map(company => (
                            <div key={company.id} className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
                                {company.logo_path && (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                        alt={company.name}
                                        className="h-8 w-auto"
                                    />
                                )}
                                <span className="text-sm">{company.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetailPage;