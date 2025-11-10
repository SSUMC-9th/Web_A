import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getLp } from "../apis/lp";

export default function LpDetailPage() {
  const { lpid } = useParams<{lpid: string}>();
  
  const { data: lp, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ["lp", lpid ],
    queryFn: () => getLp(lpid as string),
    enabled: true,
    staleTime: 60 * 1000,
  });
  if (!lpid) return <div className="text-gray-400">잘못된 접근입니다.</div>;

  const Skeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-2/3 bg-gray-600 rounded" />
      <div className="h-4 w-40 bg-gray-600 rounded" />
      <div className="h-72 w-full bg-gray-600 rounded" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-600 rounded" />
        <div className="h-4 w-11/12 bg-gray-600 rounded" />
        <div className="h-4 w-10/12 bg-gray-600 rounded" />
        <div className="h-4 w-9/12 bg-gray-600 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-20 bg-gray-600 rounded" />
        <div className="h-9 w-20 bg-gray-600 rounded" />
        <div className="h-9 w-20 bg-gray-600 rounded" />
      </div>
    </div>
  );
  
  // 데이터가 생기기 전엔(또는 로딩 중엔) 스켈레톤 고정
  const showSkeleton = !lp || isPending || (isFetching && !lp);
  if (showSkeleton) return <Skeleton />;



  if (isError)
    return (
      <div className="text-center text-gray-400">
        불러오기 실패 <button onClick={() => refetch()} className="underline">재시도</button>
      </div>
    );

  return (
    <article>
      <header>
        <h1 className="text-3xl font-extrabold">{lp.title}</h1>
        <p>{new Date(lp.createdAt).toLocaleString()} · ❤ {lp.likes}</p>
      </header>

      {lp.thumbnailUrl && (
        <div className="rounded bg-gray-800 p-4 mb-6">
          <img src={lp.thumbnailUrl} alt={lp.title} className="mx-auto rounded shadow max-h-96 md:max-h-28rem object-contain" />
        </div>
      )}

      <section className="prose prose-invert max-w-none">
        <p>{lp.body}</p>
      </section>

      <footer className="mt-8 flex gap-3">
        <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700">수정</button>
        <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700">삭제</button>
        <button className="px-3 py-1 bg-pink-600 hover:bg-pink-500">좋아요</button>
      </footer>
    </article>
  );
}
