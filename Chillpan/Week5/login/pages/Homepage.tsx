import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import type { ResponseLpListDto } from "../src/types/lp";
import type { Lp } from "../src/types/lp";
import { useInView } from "react-intersection-observer";
import LpCardSkeleton from "../components/LpCard/LpCardSkeleton";
interface OutletContextType {
  order: "asc" | "desc";
  showSearch: boolean;
}

const HomePage = () => {
  const { order, showSearch } = useOutletContext<OutletContextType>();
  const [search, setSearch] = useState("");

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
    search,
    order === "asc" ? PAGINATION_ORDER.asc : PAGINATION_ORDER.desc
  );

  // ref, inView
  // ref -> 특정한 HTML 요소를 감시할 수 있다.
  // inView -> 그 요소가 화면에 보이면 true
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      //
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  return (
    <div className="min-h-full p-4">
      {showSearch && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="제목으로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-gray-600"
          />
        </div>
      )}

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
                    className="bg-gray-800 rounded-lg overflow-hidden"
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
    </div>
  );
};

export default HomePage;
