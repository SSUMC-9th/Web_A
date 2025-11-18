import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";

export default function LpListPage() {
  const nav = useNavigate();
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  const { data, isPending, isError, refetch, isFetching } = useGetLpList({
    order,
    limit: 30,
  });

  const Skeleton = () => (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i} className="space-y-2 animate-pulse">
          <div className="w-full h-40 bg-gray-600 rounded" />
          <div className="h-4 w-3/4 bg-gray-600 rounded" />
          <div className="h-4 w-1/2 bg-gray-600 rounded" />
        </li>
      ))}
    </ul>
  );
  
  const noPayload = !data || !Array.isArray(data.data); // 응답 자체가 아직 없음
  const showSkeleton = noPayload || isPending || (isFetching && noPayload);

  return (
    <section className="space-y-4">
      {/* 정렬 버튼 2개 동시 노출 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOrder(PAGINATION_ORDER.desc)}
          className={[
            "px-3 py-1 rounded border",
            order === PAGINATION_ORDER.desc
              ? "bg-white text-gray-900 border-white"
              : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700",
          ].join(" ")}
        >
          최신순
        </button>
        <button
          onClick={() => setOrder(PAGINATION_ORDER.asc)}
          className={[
            "px-3 py-1 rounded border",
            order === PAGINATION_ORDER.asc
              ? "bg-white text-gray-900 border-white"
              : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700",
          ].join(" ")}
        >
          오래된순
        </button>
        {isFetching && <span className="text-sm text-gray-400">업데이트 중…</span>}
      </div>

      {/* 스켈레톤 */}
      {showSkeleton && <Skeleton />}
      
      {isError && !showSkeleton && (
        <div className="text-center text-gray-400">
          문제 발생… <button onClick={() => refetch()} className="underline">재시도</button>
        </div>
      )}

      {!showSkeleton && !isError && (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.data?.map((lp) => (
            <li
              key={lp.id}
              className="relative rounded overflow-hidden cursor-pointer group"
              onClick={() => nav(`/lp/${lp.id}`)}
              title={lp.title}
            >
              {lp.thumbnailUrl ? (
                <img
                  src={lp.thumbnailUrl}
                  alt={lp.title}
                  className="w-full h-40 object-cover transition-transform duration-150 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="w-full h-40 bg-gray-800" />
              )}
              <div className="absolute inset-x-0 bottom-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="font-semibold line-clamp-1">{lp.title}</h3>
                <p className="text-sm opacity-90">
                  {new Date(lp.createdAt).toLocaleDateString()} · ❤ {lp.likes}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
