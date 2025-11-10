import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PAGINATION_ORDER } from "../enums/common";
import useInfiniteLpList from "../hooks/queries/useInfiniteLpList";
import CardGridSkeleton from "../components/skeletons/CardGridSkeleton";
import { usePagingSentinel } from "../hooks/usePagingSentinel";
import LpListItem from "../components/lp/LpListItem";

export default function LpListPage() {
  const nav = useNavigate();
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  // 서버 과부화 고려
  const limit = 30;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetching,
  } = useInfiniteLpList({ sort: order, limit });

  const items = useMemo(
    () => (data ? data.pages.flatMap((p) => p.data) : []),
    [data]
  );

  // root를 상태로 보관하고 준비되면 옵저버 연결
  const [rootEl, setRootEl ] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setRootEl(document.getElementById("app-scroll"));
  }, []);

  // 스켈레톤 최소 노출시간 적용
  const [holdSkeleton, setHoldSkeleton] = useState(true);
  useEffect(() => {
    setHoldSkeleton(true);
      const t = setTimeout(() => setHoldSkeleton(false), 300);
      return () => clearTimeout(t);
  }, [order]);

  const noFirstPayload = !data || data.pages.length === 0;
  const showInitialSkeleton
    = noFirstPayload && (isLoading || (isFetching && !isFetchingNextPage));

  // 센티넬 : 트리거에서 fetchNextPage()
  const sentinelRef = usePagingSentinel<HTMLDivElement>({
    root: rootEl,
    enabled: !!hasNextPage && !isFetchingNextPage,
    onHit: () => fetchNextPage(),
  });

  return (
    <section className="space-y-4">
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

        {isFetching && !isFetchingNextPage && <span className="text-sm text-gray-400">업데이트 중…</span>}

      </div>

      {/* 초기 스켈레톤 */}
      {(showInitialSkeleton || (holdSkeleton && noFirstPayload)) && (
        <CardGridSkeleton count={12} itemHeightClass="h-40" />
      )}
    
      {isError && !showInitialSkeleton && !holdSkeleton && (
        <div className="text-center text-gray-400">
          문제 발생… {"  "}
          <button onClick={() => refetch()} className="underline">
            재시도
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((lp) => (
              <LpListItem
                key={lp.id}
                lp={lp}
                onClick={() => nav(`/lp/${lp.id}`)}
              />
            ))}
          </ul>

          {/* 추가 로딩 스켈레톤 + sentinel */}
          {isFetchingNextPage && <CardGridSkeleton count={8} itemHeightClass="h-40" /> }
          <div ref={sentinelRef} className="h-8" />

          {!hasNextPage && items.length > 0 && (
            <div className="text-center text-gray-500 py-6">마지막 페이지</div>
          )}
        </>
      )}
    </section>
  );
}
