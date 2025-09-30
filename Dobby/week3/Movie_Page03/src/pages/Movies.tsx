import { useEffect, useState } from "react";
import { fetchTrending, type Movie, tmdbImg } from "../api/tmdb";

export default function Movies() {
  const [items, setItems] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    fetchTrending("day")
      .then((data) => setItems(data.results))
      .catch((e) => !ac.signal.aborted && setError(e.message))
      .finally(() => !ac.signal.aborted && setLoading(false));
    return () => ac.abort();
  }, []);

  if (error) return <p className="p-6 text-red-500">에러: {error}</p>;
  if (loading) {
    // 아주 간단한 스켈레톤
    return (
      <ul className="grid gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <li key={i} className="card h-[320px] bg-neutral-800 animate-pulse" />
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </ul>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  const img = tmdbImg(movie.poster_path, "w500");
  return (
    <li className="group relative card h-[320px]">
      {/* 포스터 이미지 */}
      {img ? (
        <img
          src={img}
          alt={movie.title}
          className="h-full w-full object-cover transition duration-300 group-hover:blur-sm group-hover:scale-[1.03]"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-neutral-400">
          No image
        </div>
      )}

      {/* 어둡게 + 그라데이션 오버레이 (hover 시 나타남) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* 텍스트 레이어 */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="text-white text-lg font-semibold drop-shadow">{movie.title}</h3>
        <p className="mt-1 text-white/90 text-sm line-clamp-3">{movie.overview}</p>
      </div>
    </li>
  );
}
