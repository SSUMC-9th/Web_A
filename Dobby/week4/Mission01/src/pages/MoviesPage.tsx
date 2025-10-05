import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom"; // ✅ Link 사용
import { fetchByCategory, tmdbImg, type Movie } from "../api/tmdb";

type Props = { category: "popular" | "now_playing" | "top_rated" | "upcoming" };

export default function MoviesPage({ category }: Props) {
  const [search, setSearch] = useSearchParams();

  // URL ?page= 관리 (기본 1)
  const page = useMemo(() => Math.max(1, Number(search.get("page") ?? 1)), [search]);
  const [items, setItems] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);

    fetchByCategory(category, page)
      .then((data) => {
        if (!mounted) return;
        setItems(data.results);
        setTotalPages(data.total_pages);
      })
      .catch((e) => mounted && setErr(e.message ?? "에러가 발생했습니다."))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [category, page]);

  const go = (p: number) => {
    setSearch((prev) => {
      const s = new URLSearchParams(prev);
      s.set("page", String(p));
      return s;
    }, { replace: false });
    // 스크롤 상단으로
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <section>
      {/* 상단 페이지네이션 */}
      <div className="mb-4 flex items-center justify-center gap-3">
        <button
          disabled={prevDisabled}
          onClick={() => go(page - 1)}
          className={`rounded-md px-3 py-2 text-sm shadow ${
            prevDisabled ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                         : "bg-neutral-700 hover:bg-neutral-600"
          }`}
          aria-label="이전 페이지"
        >
          &lt;
        </button>
        <span className="text-sm text-neutral-300">{page} 페이지</span>
        <button
          disabled={nextDisabled}
          onClick={() => go(page + 1)}
          className={`rounded-md px-3 py-2 text-sm shadow ${
            nextDisabled ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                         : "bg-emerald-600 hover:bg-emerald-500"
          }`}
          aria-label="다음 페이지"
        >
          &gt;
        </button>
      </div>

      {/* 로딩/에러/데이터 */}
      {loading && <Spinner />}
      {err && <p className="p-6 text-red-400">{err}</p>}

      {!loading && !err && (
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </ul>
      )}
    </section>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  const img = tmdbImg(movie.poster_path, "w500");

  return (
    <li className="group relative rounded-2xl overflow-hidden shadow-md bg-neutral-900/40">
      <Link to={`/movies/${movie.id}`} className="block">  {/* ✅ 상세로 이동 */}
        {img ? (
          <img
            src={img}
            alt={movie.title}
            className="h-[320px] w-full object-cover transition duration-300 group-hover:blur-sm group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="h-[320px] flex items-center justify-center bg-neutral-800 text-neutral-400">
            No Image
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <h3 className="text-white text-base font-semibold drop-shadow">{movie.title}</h3>
          <p className="mt-1 text-white/90 text-sm line-clamp-3">{movie.overview}</p>
        </div>
      </Link>
    </li>
  );
}

function Spinner() {
  return (
    <div className="py-16 flex justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-300 border-t-transparent" />
    </div>
  );
}


