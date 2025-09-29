import Link from "../Link";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">홈</h1>

      <Link
        to="/movies"
        className="inline-block rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
      >
        트렌딩 영화 보러가기
      </Link>
    </main>
  );
}
