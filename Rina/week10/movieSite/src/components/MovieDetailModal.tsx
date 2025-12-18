import { useEffect } from "react";
import type { Movie } from "../types/movie";

interface MovieDetailModalProps{
    movie: Movie;
    open: boolean;
    onClose: () => void;
}

export default function MovieDetailModal({
    movie,
    open,
    onClose,
}: MovieDetailModalProps) {
    const imageBaseUrl = "https://image.tmdb.org/t/p/original";
    const posterBaseUrl = "https://image.tmdb.org/t/p/w500";
    const fallbackBackdrop = "https://placehold.co/1200x500.png?text=Movie";
    const fallbackPoster = "https://placehold.co/500x750.png?text=Movie";

    const backdropUrl = movie.backdrop_path
        ? `${imageBaseUrl}${movie.backdrop_path}`
        : fallbackBackdrop;

    const posterUrl = movie.poster_path
        ? `${posterBaseUrl}${movie.poster_path}`
        : fallbackPoster;

    // 스크롤 잠금
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    // ESC로 닫기
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-label="영화 상세 정보"
        >
            {/* dim */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* 모달 */}
            <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="relative h-56 w-full bg-black">
                    <img
                        src={backdropUrl}
                        alt={`${movie.title} 배경`}
                        className=" h-full w-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"/>

                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-2 text-white hover:bg-black/70 cursor-pointer"
                        aria-label="닫기"
                        type="button"
                    >
                        ✕
                    </button>

                    <div className="absolute bottom-4 left-6">
                        <h2 className="text-2xl font-extrabold text-white">{movie.title}</h2>
                        <p className="mt-1 text-sm text-white/80">
                            {movie.original_title}
                        </p>
                    </div>
                </div>

                {/* 콘텐츠 */}
                <div className="flex flex-col gap-6 p-6 md:flex-row">
                    {/* 포스터 */}
                    <div className="w-full md:w-56">
                        <img
                            src={posterUrl}
                            alt={`${movie.title} 포스터`}
                            className="w-full rounded-xl object-cover shadow-lg"
                        />
                    </div>

                    {/* info */}
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                                {movie.vote_average.toFixed(1)} <span>({movie.vote_count} 평가)</span>
                            </div>

                            <div className="text-sm text-gray-600">
                                개봉일 <span className="font-semibold text-gray-800">{movie.release_date || "-"}</span>
                            </div>

                            <div className="text-sm text-gray-600">
                                언어{" "}
                                <span className="font-semibold text-gray-800">
                                    {movie.original_language?.toUpperCase?.() ?? "-"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-5">
                            <h3 className="text-base font-extrabold text-gray-900">줄거리</h3>
                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                                {movie.overview?.trim() ? movie.overview : "줄거리 정보가 없습니다."}
                            </p>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <a
                                href={imdbUrl}
                                target="_blank"
                                rel="noopener noreferer"
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                            >
                                IMDB에서 검색
                            </a>

                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}