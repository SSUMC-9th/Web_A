import { useEffect, useMemo, useRef, useState } from "react";
import ErrorView from "../components/ErrorView";
import LPCard from "../components/LPCard";
import SkeletonCard from "../components/SkeletonCard";
import { PAGINATION_ORDER } from "../enums/common";
import useGetInfiniteLpList from "../hooks/queries/useInfiniteLpList";

type LpItem = {
  id: number;
  title: string;
  thumbnail: string;
  createdAt: string | Date;
  likes: unknown[];
};

const HomePage = () => {
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const PAGE_LIMIT = 50;
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetInfiniteLpList(PAGE_LIMIT, "", order);

  const items: LpItem[] = useMemo(() => {
    return (data?.pages.flatMap(
      (page) => (page as unknown as { data?: { data?: LpItem[] } })?.data?.data ?? []
    ) ?? []) as LpItem[];
  }, [data]);

  // 무한 스크롤 트리거 (IntersectionObserver로 바닥 근처에 닿으면 다음 페이지 로딩)
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(target);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 스크롤 이벤트 백업 트리거(일부 브라우저/환경에서 IO가 동작하지 않을 때 대비)
  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      if (nearBottom && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-end mb-4 gap-2">
        <button
          onClick={() =>
            setOrder((o) =>
              o === PAGINATION_ORDER.desc ? PAGINATION_ORDER.asc : PAGINATION_ORDER.desc
            )
          }
          className="h-8 px-3 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm"
        >
          {order === PAGINATION_ORDER.desc ? "최신순" : "오래된순"}
        </button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
          {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
      {isError && <ErrorView onRetry={() => void refetch()} />}

      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
            {items.map((lp) => (
              <LPCard
                key={lp.id}
                id={lp.id}
                title={lp.title}
                thumbnail={lp.thumbnail}
                createdAt={lp.createdAt}
                likesCount={Array.isArray(lp.likes) ? lp.likes.length : 0}
              />
            ))}
          </div>
          <div ref={loadMoreRef} className="h-6" />
          {isFetchingNextPage && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 mt-2">
              {Array.from({ length: Math.ceil(PAGE_LIMIT / 2) }).map((_, i) => (
                <SkeletonCard key={`next-${i}`} />
              ))}
            </div>
          )}
          {!hasNextPage && (
            <div className="py-4 text-center text-zinc-500 text-sm">마지막 페이지입니다</div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
