import { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useLpSearch } from '../../hooks/useLpSearch';
import { LpCard } from './LpCard';
import { SkeletonCard } from '../common/SkeletonCard';

export const LpSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: filteredLps, isLoading, isError } = useLpSearch(debouncedQuery);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 검색 입력창 */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="LP 제목, 내용 검색..."
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
        
        {import.meta.env.DEV && searchQuery && (
          <div className="mt-2 text-sm text-gray-500 space-y-1">
            <p>현재 입력: "{searchQuery}"</p>
            <p>검색 쿼리: "{debouncedQuery}"</p>
            <p className="text-xs text-blue-600">
              💡 타이핑을 멈추면 300ms 후 검색이 시작됩니다.
            </p>
          </div>
        )}
      </div>

      {/* 검색 결과 */}
      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-red-600">검색 중 오류가 발생했습니다.</p>
          </div>
        ) : !debouncedQuery.trim() ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
            <p className="text-gray-500">검색어를 입력해주세요.</p>
          </div>
        ) : filteredLps?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">검색 결과가 없습니다.</p>
            <p className="text-sm text-gray-400">
              "{debouncedQuery}"에 대한 결과를 찾을 수 없습니다.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              총 {filteredLps?.length || 0}개의 결과
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLps?.map((lp) => <LpCard key={lp.id} lp={lp} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};