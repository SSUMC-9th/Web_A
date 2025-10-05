import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">React Router + TMDB</h1>
      <p className="text-neutral-400 mb-6">상단 탭에서 카테고리를 선택해 보세요.</p>
      <Link
        to="/popular?page=1"
        className="inline-block rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500"
      >
        인기 영화 보러가기
      </Link>
    </main>
  );
}
