import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getLpList } from '../apis/lp';
import ErrorMessage from '../components/ErrorMessage';
import SkeletonCard from '../components/SkeletonCard';

const LpListPage: React.FC = () => {
    const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
    const observerRef = useRef<HTMLDivElement>(null);

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['lps', sort],
        queryFn: ({ pageParam = 0 }) => getLpList({ sort, cursor: pageParam.toString(), take: 10 }),
        getNextPageParam: (lastPage) => {
            return lastPage?.data?.hasNext ? lastPage.data.nextCursor : undefined;
        },
        initialPageParam: 0,
    });

    // Intersection Observer로 무한 스크롤
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    //호출
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isError) return <ErrorMessage />;

    const allLps = data?.pages.flatMap(page => page?.data?.data || []) || [];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">LP 목록</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSort('latest')}
                        className={`px-4 py-2 rounded ${sort === 'latest'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        최신순
                    </button>
                    <button
                        onClick={() => setSort('oldest')}
                        className={`px-4 py-2 rounded ${sort === 'oldest'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        오래된순
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* 초기 로딩 - 상단 스켈레톤 */}
                {isLoading && (
                    <>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonCard key={`skeleton-top-${i}`} />
                        ))}
                    </>
                )}

                {/* 데이터 렌더링 */}
                {!isLoading && allLps.map((lp: any) => (
                    <Link
                        key={lp.id}
                        to={`/lp/${lp.id}`}
                        className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                    >
                        <img
                            src={lp.thumbnail}
                            alt={lp.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
                            <h3 className="text-white font-bold text-lg mb-2">{lp.title}</h3>
                            <div className="flex items-center gap-3 text-white text-sm">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                    {lp.likes?.length || 0}
                                </span>
                                <span>{new Date(lp.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Link>
                ))}

                {/* 추가 로딩 - 하단 스켈레톤 */}
                {isFetchingNextPage && (
                    <>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <SkeletonCard key={`skeleton-bottom-${i}`} />
                        ))}
                    </>
                )}
            </div>

            {/* Intersection Observer 타겟 */}
            <div ref={observerRef} className="h-10" />
        </div>
    );
};

export default LpListPage;
