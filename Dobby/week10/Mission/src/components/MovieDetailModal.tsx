import { useEffect, useId } from 'react';
import type { Movie } from '../types/movie';

interface MovieDetailModalProps {
  isOpen: boolean;
  movie: Movie | null;
  onClose: () => void;
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const IMAGE_ORIGINAL_BASE_URL = 'https://image.tmdb.org/t/p/original';
const FALLBACK_POSTER = 'https://via.placeholder.com/500x750?text=No+Image';
const FALLBACK_BACKDROP = 'https://via.placeholder.com/1200x600?text=No+Backdrop';

const POPULARITY_WIDTH: Record<number, string> = {
  0: 'w-0',
  10: 'w-[10%]',
  20: 'w-[20%]',
  30: 'w-[30%]',
  40: 'w-[40%]',
  50: 'w-[50%]',
  60: 'w-[60%]',
  70: 'w-[70%]',
  80: 'w-[80%]',
  90: 'w-[90%]',
  100: 'w-full',
};

function formatKoreanDate(dateStr: string) {
  if (!dateStr) return '개봉일 미상';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export default function MovieDetailModal({ isOpen, movie, onClose }: MovieDetailModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !movie) return null;

  const posterSrc = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : FALLBACK_POSTER;
  const backdropSrc = movie.backdrop_path
    ? `${IMAGE_ORIGINAL_BASE_URL}${movie.backdrop_path}`
    : FALLBACK_BACKDROP;
  const imdbUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(movie.title)}&s=tt&ttype=ft`;

  // popularity는 상한이 없어서 UI용으로만 적당히 정규화
  const popularityPct = Math.max(0, Math.min(100, Math.round((movie.popularity / 300) * 100)));
  const popularityStep = Math.max(0, Math.min(100, Math.round(popularityPct / 10) * 10));
  const popularityWidthClass = POPULARITY_WIDTH[popularityStep] ?? 'w-0';

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative mx-auto my-6 w-[min(1040px,calc(100%-2rem))]">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="max-h-[calc(100dvh-3rem)] overflow-auto rounded-2xl bg-white shadow-2xl"
        >
          {/* Hero (backdrop) */}
          <div className="relative h-[220px] sm:h-[280px]">
            <img src={backdropSrc} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-black/50 text-white shadow-sm transition hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
              aria-label="닫기"
            >
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.42 1.42L12 13.41l4.89 4.9a1 1 0 0 0 1.42-1.42L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4Z"
                />
              </svg>
            </button>

            <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
              <h3
                id={titleId}
                className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
              >
                {movie.title}
              </h3>
              <p className="mt-1 text-sm text-white/80">{movie.original_title}</p>
            </div>
          </div>

          {/* Body */}
          <div className="grid gap-6 bg-white p-5 sm:p-6 md:grid-cols-[300px,1fr]">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm">
                <img
                  src={posterSrc}
                  alt={`${movie.title} 포스터`}
                  className="aspect-[2/3] w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex gap-3">
                <a
                  href={imdbUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                >
                  IMDb에서 검색
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-indigo-300 bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                >
                  닫기
                </button>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-indigo-600">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-sm font-semibold text-neutral-500">
                    ({movie.vote_count.toLocaleString()} 평가)
                  </span>
                </div>

                {movie.adult ? (
                  <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                    청불
                  </span>
                ) : null}
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-bold text-neutral-900">개봉일</div>
                  <div className="mt-1 text-sm text-neutral-700">
                    {formatKoreanDate(movie.release_date)}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-bold text-neutral-900">인기도</div>
                  <div className="mt-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                      <div
                        className={`h-full rounded-full bg-indigo-600 ${popularityWidthClass}`}
                      />
                    </div>
                    <div className="mt-1 text-xs font-semibold text-neutral-500">
                      {movie.popularity.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7 border-t border-neutral-200 pt-6">
                <div className="text-sm font-bold text-neutral-900">줄거리</div>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-700">
                  {movie.overview?.trim() ? movie.overview : '줄거리 정보가 없습니다.'}
                </p>
              </div>

              <div className="mt-6 text-xs font-semibold text-neutral-400">
                언어: {movie.original_language.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="h-2 bg-white" />
        </div>
      </div>
    </div>
  );
}
