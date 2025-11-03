import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getLpDetail } from '../apis/lp';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

const LpDetailPage: React.FC = () => {
    const { lpid } = useParams<{ lpid: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            const confirmLogin = window.confirm('로그인이 필요한 서비스입니다. 로그인을 해주세요!');
            if (confirmLogin) {
                navigate('/login', { state: { from: location.pathname } });
            } else {
                navigate('/');
            }
        }
    }, [isAuthenticated, navigate, location]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['lp', lpid],
        queryFn: () => getLpDetail(lpid!),
        enabled: !!lpid,
    });

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <ErrorMessage />;

    const lp = data?.data;

    if (!lp) return <ErrorMessage message="LP를 찾을 수 없습니다." />;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                뒤로가기
            </button>

            <div className="mb-6">
                <img
                    src={lp.thumbnail}
                    alt={lp.title}
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
            </div>

            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-4">{lp.title}</h1>
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                    <span className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(lp.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        {lp.likes?.length || 0}
                    </span>
                </div>
            </div>

            {lp.tags && lp.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                    {lp.tags.map((tag: any) => (
                        <span
                            key={tag.id}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                            #{tag.name}
                        </span>
                    ))}
                </div>
            )}

            <div className="mb-8">
                <div className="p-6 bg-gray-50 rounded-lg whitespace-pre-wrap">
                    {lp.content}
                </div>
            </div>

            <div className="flex gap-3 justify-end border-t pt-6">
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                    삭제
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    수정
                </button>
                <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    좋아요
                </button>
            </div>
        </div>
    );
};

export default LpDetailPage;
