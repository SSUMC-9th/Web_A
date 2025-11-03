import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getLP } from "../apis/lp";

export default function LpDetailPage() {
    const {lpid = ''} = useParams();
    const {data: lp, isLoading, isError, refetch} = useQuery({
        queryKey: ['lp', lpid],
        queryFn: () => getLP(lpid),
        staleTime: 60 * 1_000,  // 1분
    })

    if (isLoading) return <div className="animate-pulse h-64 rounded bg-gray-800"/>
    if (isError || !lp) return (
        <div className="text-center text-gray-400">
            불러오기 실패
            <button onClick={() => refetch()} className="underline">재시도</button>
        </div>
    )
    
    return (
        <article>
            <header>
                <h1>{lp.title}</h1>
                <p>{new Date(lp.createdAt).toLocaleString()} · ❤ {lp.likes}</p>
            </header>

            <div className="rounded bg-gray-800 p-4 mb-6">
                <img src={lp.thumbnailUrl} alt={lp.title} className="mx-auto rounded shadow" />
            </div>

            <section className="prose prose-invert max-w-none">
                <p>{lp.body}</p>
            </section>

            <footer className="mt-8 flex gap-3">
                <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700">수정</button>
                <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700">삭제</button>
                <button className="px-3 py-1 bg-pink-600 hover:bg-pink-500">좋아요</button>
            </footer>
        </article>
    )
}