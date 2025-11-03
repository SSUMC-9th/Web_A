import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLPs } from "../apis/lp";

export default function LpListPage() {
    const [sort, setSort] = useState<'latest'|'oldest'>('latest');
    const navigate = useNavigate();

    const { data, isLoading, isError, refetch, error } = useQuery({
        queryKey: ['lps', sort],
        queryFn: ()=> getLPs(sort),
        staleTime: 30 * 1_000,  // 30초 
        gcTime: 5 * 60 * 1_000  // 5분 후 가비지컬렉션
    })

    return (
        <div>
            <div className="flex items-center justify-end gap-2 mb-4">
                <button
                    onClick={() => setSort('oldest')}
                    className={`px-3 py-1 rounded border ${sort === 'oldest' ?  'bg-white text-black': 'border-gray-600 text-gray-300'}`}
                >오래된순</button>
                <button
                    onClick={() => setSort('latest')}
                    className={`px-3 py-1 rounded border ${sort === 'latest' ?  'bg-white text-black': 'border-gray-600 text-gray-300'}`}
                >최신순</button>
            </div>

            {isLoading && <ListSkeleton />}
            {isError && (
                <div className="text-center text-gray-400">
                    오류가 발생했습니다.
                    <button onClick={() => refetch()} className="underline">다시 시도</button>
                    <pre className="text-xs mt-2 opacity-60">{String(error)}</pre>
                </div>
            )}

            {data && (
                <ul className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
                    {data?.data.map((lp)=> (
                        <li key={lp.id}>
                            <button
                                onClick={() => navigate(`/lp/${lp.id}`)}
                                className="group relative block w-full aspect-square overflow-hidden rounded shadow bg-gray-800"
                            >
                                <img src={lp.thumbnailUrl} alt="lp.title" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="font-semibold text-white drop-shadow">{lp.title}</p>
                                    <p className="text-xs text-gray-200">❤ {lp.likes}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

function ListSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
            {Array.from({length: 12}).map((_, i) => (
                <div key={i} className="animate-pulse rounded aspect-square bg-gray-800" />
            ))}
        </div>
    )
}