import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getLpList } from '../apis/lp';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const LpListPage: React.FC = () => {
    const [sort, setSort] = useState<'latest' | 'oldest'>('latest');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['lps', sort],
        queryFn: () => getLpList({ sort, take: 50 }),
        //take: 50 해도 10개만 반환됨...
    });

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <ErrorMessage />;

    const lps = data?.data?.data || [];

    // 프론트엔드에서 정렬
    const sortedLps = [...lps].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sort === 'latest' ? dateB - dateA : dateA - dateB;
    });

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
                {sortedLps.map((lp: any) => (
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
            </div>
        </div>
    );
};

export default LpListPage;
