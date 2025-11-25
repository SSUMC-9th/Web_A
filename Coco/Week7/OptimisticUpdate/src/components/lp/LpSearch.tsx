// components/lp/LpSearch.tsx
import { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useLpSearch } from '../../../../../Week8/OptimisticUpdate/src/hooks/useLpSearch';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { LpCard } from './LpCard';
import { SkeletonCard } from '../common/SkeletonCard';

export const LpSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // 디바운싱 적용: 사용자가 타이핑을 멈춘 후 300ms 뒤에 검색
  const debouncedQuery = useDebounce(searchQuery, 300);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
  } = useLpSearch(debouncedQuery);

  const { ref } = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 검색 입력창 */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="LP 제목, 내용, 태그 검색..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        {/* 실시간 입력 값과 디바운싱된 값 표시 (디버깅용) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 text-sm text-gray-500">
            <p>현재 입력: "{searchQuery}"</p>
            <p>검색 쿼리: "{debouncedQuery}"</p>
          </div>
        )}
      </div>

      {/* 검색 결과 */}
      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-red-600">검색 중 오류가 발생했습니다.</p>
          </div>
        ) : !debouncedQuery.trim() ? (
          <div className="text-center py-12">
            <p className="text-gray-500">검색어를 입력해주세요.</p>
          </div>
        ) : data?.pages[0]?.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.pages.map((page) =>
                page.items.map((lp) => <LpCard key={lp.id} lp={lp} />)
              )}
            </div>

            {isFetchingNextPage && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={`loading-${i}`} />
                ))}
              </div>
            )}

            <div ref={ref} className="h-4" />
          </>
        )}
      </div>
    </div>
  );
};