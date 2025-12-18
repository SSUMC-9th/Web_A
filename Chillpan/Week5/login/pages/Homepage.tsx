import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import type { ResponseLpListDto } from "../src/types/lp";
import type { Lp } from "../src/types/lp";
import { useInView } from "react-intersection-observer";
import LpCardSkeleton from "../components/LpCard/LpCardSkeleton";
import LpDetailModal from "../components/LpDetailModal";
import useDebounce from "../hooks/useDebounce";
import useThrottle from "../hooks/queries/useThrottle";
import { DEBOUNCE_DELAY, THROTTLE_DELAY } from "../constants/Delay";
import React from "react";

interface OutletContextType {
  order: "asc" | "desc";
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const HomePage = () => {
  const { order, searchTerm } = useOutletContext<OutletContextType>();
  const [selectedLpId, setSelectedLpId] = useState<number | null>(null);
  const debouncedValue = useDebounce(searchTerm, DEBOUNCE_DELAY); // Week 7

  //const { data, isPending, isError, error } = useGetLpList({ -> 무한스크롤 구현 위해 주석 처리.
  // search,
  // order: order === "asc" ? PAGINATION_ORDER.asc : PAGINATION_ORDER.desc,
  // limit: 50,
  //});

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
    error,
  } = useGetInfiniteLpList(
    20, // 초기 로딩 속도에 영향을 줆.
    debouncedValue, // Week 7
    order === "asc" ? PAGINATION_ORDER.asc : PAGINATION_ORDER.desc
  );

  // ref, inView
  // ref -> 특정한 HTML 요소를 감시할 수 있다.
  // inView -> 그 요소가 화면에 보이면 true
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const throttledInView = useThrottle(inView, THROTTLE_DELAY);

  useEffect(
    () => {
      //if (inView && !isFetching && hasNextPage) { ->
      if (throttledInView && !isFetching && hasNextPage) {
        //
        fetchNextPage();
      }
    },
    /*[inView, isFetching, hasNextPage, fetchNextPage] -> */ [
      throttledInView,
      isFetching,
      hasNextPage,
      fetchNextPage,
    ]
  );

  return (
    <div className="relative min-h-full p-4">
      {isError && <div className="text-white">Error: {error?.message}</div>}

      {isPending ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <LpCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {!lps?.pages || lps.pages.length === 0 ? (
            <div className="text-white">데이터가 없습니다.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {lps.pages
                ?.map((page: ResponseLpListDto) => page.data.data)
                ?.flat()
                ?.map((lp: Lp) => (
                  <div
                    key={lp.id}
                    className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                    onClick={() => setSelectedLpId(lp.id)}
                  >
                    <div className="aspect-square bg-gray-700 flex items-center justify-center overflow-hidden">
                      {lp.thumbnail ? (
                        <img
                          src={lp.thumbnail}
                          alt={lp.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-4xl">🎵</span>
                      )}
                    </div>
                    <div className="p-3 text-white">
                      <h3 className="font-semibold truncate">{lp.title}</h3>
                      <p className="text-xs text-gray-400 truncate">
                        {lp.content}
                      </p>
                    </div>
                  </div>
                ))}
              {/* 추가 로딩 중일 때 스켈레톤 표시 */}
              {isFetching &&
                Array.from({ length: 6 }).map((_, index) => (
                  <LpCardSkeleton key={`skeleton-${index}`} />
                ))}
            </div>
          )}
          {hasNextPage && (
            <div ref={ref} className="h-10 flex items-center justify-center">
              {isFetching && (
                <div className="text-white">더 불러오는 중...</div>
              )}
            </div>
          )}
        </>
      )}
      {selectedLpId !== null && (
        <LpDetailModal
          lpId={selectedLpId}
          onClose={() => setSelectedLpId(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
