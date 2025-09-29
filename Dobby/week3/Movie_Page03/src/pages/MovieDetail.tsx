import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchMovieCredits,
  fetchMovieDetails,
  tmdbImg,
  type Credits,
  type MovieDetails,
} from "../api/tmdb";

// 작은 포맷터들
const yearOf = (date?: string) => (date ? new Date(date).getFullYear() : "");
const minutesToKR = (m?: number | null) =>
  typeof m === "number" ? `${Math.floor(m / 60)}시간 ${m % 60}분` : "";

export default function MovieDetail() {
  const navigate = useNavigate();  
  const { movieId } = useParams();
  const id = useMemo(() => Number(movieId), [movieId]);

  const [detail, setDetail] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setErr("잘못된 영화 ID입니다.");
      setLoading(false);
      return;
    }
    let ok = true;
    setLoading(true);
    setErr(null);

    Promise.all([fetchMovieDetails(id), fetchMovieCredits(id)])
      .then(([d, c]) => {
        if (!ok) return;
        setDetail(d);
        setCredits(c);
      })
      .catch((e) => ok && setErr(e.message ?? "데이터를 불러오지 못했습니다."))
      .finally(() => ok && setLoading(false));

    return () => {
      ok = false;
    };
  }, [id]);

  if (loading) return <Spinner />;
  if (err) return <ErrorBox message={err} />;

  if (!detail) return <ErrorBox message="영화 정보를 찾을 수 없습니다." />;

  const director = credits?.crew?.find((p) => p.job === "Director");
  const topCast = (credits?.cast ?? []).slice(0, 16);

  const backdrop = tmdbImg(detail.backdrop_path, "w1280");
  const poster = tmdbImg(detail.poster_path, "w500");

  return (
    <article className="text-neutral-100">
      {/* 히어로 영역 */}
      <section className="relative mb-8 overflow-hidden rounded-2xl border border-neutral-800">
        {backdrop ? (
          <img src={backdrop} alt="" className="h-[240px] w-full object-cover md:h-[320px]" />
        ) : (
          <div className="h-[240px] w-full bg-neutral-800 md:h-[320px]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-bold">{detail.title}</h1>
          <div className="mt-2 text-sm text-neutral-300 space-x-3">
            <span>평균 {detail.vote_average?.toFixed(1)}</span>
            <span>{yearOf(detail.release_date)}</span>
            <span>{minutesToKR(detail.runtime)}</span>
          </div>
          {detail.tagline && (
            <p className="mt-3 italic text-neutral-200">{detail.tagline}</p>
          )}
        </div>
      </section>

      {/* 본문: 포스터 + 개요 */}
      <section className="grid gap-6 md:grid-cols-[200px,1fr]">
        <div>
          {poster ? (
            <img
              src={poster}
              alt={detail.title}
              className="w-[200px] rounded-xl shadow-md"
            />
          ) : (
            <div className="w-[200px] h-[300px] rounded-xl bg-neutral-800" />
          )}
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold">줄거리</h2>
          <p className="leading-relaxed text-neutral-300">{detail.overview || "설명이 없습니다."}</p>

          {detail.genres?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {detail.genres.map((g) => (
                <span key={g.id} className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300">
                  {g.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 감독/출연 */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">감독/출연</h2>
        {director && (
          <div className="mb-6">
            <PersonChip
              name={director.name}
              role="Director"
              profile_path={director.profile_path}
            />
          </div>
        )}

        <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {topCast.map((p) => (
            <li key={p.id}>
              <PersonChip name={p.name} role={p.character} profile_path={p.profile_path} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <button
          onClick={() => navigate(-1)}  
          className="inline-block rounded-lg border border-neutral-700 px-4 py-2 text-neutral-300 hover:bg-neutral-800"
            aria-label="뒤로 가기"
        >
           ← 뒤로
        </button>
      </div>
    </article>
  );
}

function PersonChip({
  name,
  role,
  profile_path,
}: {
  name: string;
  role?: string;
  profile_path: string | null;
}) {
  const img = tmdbImg(profile_path, "w185");
  return (
    <div className="flex items-center gap-3">
      {img ? (
        <img
          src={img}
          alt={name}
          className="h-14 w-14 rounded-full object-cover ring-2 ring-neutral-700"
          loading="lazy"
        />
      ) : (
        <div className="h-14 w-14 rounded-full bg-neutral-800 ring-2 ring-neutral-700" />
      )}
      <div>
        <div className="font-medium text-neutral-200">{name}</div>
        {role && <div className="text-xs text-neutral-400">{role}</div>}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="py-16 flex justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-300 border-t-transparent" />
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="p-6 rounded-lg border border-red-700 bg-red-950/40 text-red-300">
      {message}
    </div>
  );
}
