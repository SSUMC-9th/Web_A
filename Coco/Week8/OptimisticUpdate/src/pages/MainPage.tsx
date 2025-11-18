import { useState } from 'react';
import { useLpList } from '../hooks/useLpQueries';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { LpCard } from '../components/lp/LpCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import type { SortOrder } from '../types/lp.types';

export const MainPage = () => {
  const [sort, setSort] = useState<SortOrder>('latest');
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useLpList(sort);
  
  const { ref } = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  return (
    <div className="p-6">
      {/* 정렬 버튼 */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setSort('latest')}
          className={`px-4 py-2 rounded ${
            sort === 'latest' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          최신순
        </button>
        <button
          onClick={() => setSort('oldest')}
          className={`px-4 py-2 rounded ${
            sort === 'oldest' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          오래된순
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            {/* ✅ 안전한 체크 추가 */}
            {data?.pages?.map((page) =>
              page?.items?.map((lp) => <LpCard key={lp.id} lp={lp} />)
            )}
            {isFetchingNextPage &&
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`loading-${i}`} />)
            }
          </>
        )}
      </div>
      
      {/* 데이터가 없을 때 */}
      {!isLoading && (!data?.pages || data.pages.length === 0 || data.pages[0]?.items?.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          게시글이 없습니다.
        </div>
      )}

      <div ref={ref} className="h-10" />
    </div>
  );
};