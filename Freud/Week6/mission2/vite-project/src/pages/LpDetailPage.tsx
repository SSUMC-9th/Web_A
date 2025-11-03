import React, { useEffect, useState, useRef } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getLpDetail } from '../apis/lp';
import { getCommentList } from '../apis/comment';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SkeletonComment from '../components/SkeletonComment';
import { useAuth } from '../context/AuthContext';

const LpDetailPage: React.FC = () => {
    const { lpid } = useParams<{ lpid: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const [order, setOrder] = useState<'latest' | 'oldest'>('latest');
    const [commentText, setCommentText] = useState('');
    const observerRef = useRef<HTMLDivElement>(null);

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

    // 댓글 무한 스크롤
    const {
        data: commentsData,
        isLoading: commentsLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['lpComments', lpid, order],
        queryFn: ({ pageParam = 0 }) => getCommentList(lpid!, { sort: order, cursor: pageParam.toString(), take: 10 }),
        getNextPageParam: (lastPage) => {
            return lastPage?.data?.hasNext ? lastPage.data.nextCursor : undefined;
        },
        initialPageParam: 0,
        enabled: !!lpid,
    });

    // Intersection Observer로 댓글 무한 스크롤
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
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

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <ErrorMessage />;

    const lp = data?.data;

    if (!lp) return <ErrorMessage message="LP를 찾을 수 없습니다." />;

    const allComments = commentsData?.pages.flatMap(page => page?.data?.data || []) || [];

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: 댓글 작성 API 연동
        console.log('댓글 작성:', commentText);
        setCommentText('');
    };

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

            <div className="flex gap-3 justify-end border-t pt-6 mb-8">
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

            {/* 댓글 섹션 */}
            <div className="border-t pt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">댓글</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setOrder('latest')}
                            className={`px-3 py-1 rounded text-sm ${order === 'latest'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            최신순
                        </button>
                        <button
                            onClick={() => setOrder('oldest')}
                            className={`px-3 py-1 rounded text-sm ${order === 'oldest'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            오래된순
                        </button>
                    </div>
                </div>

                {/* 댓글 작성란 */}
                <form onSubmit={handleCommentSubmit} className="mb-6">
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
                        rows={3}
                        placeholder="댓글을 입력하세요..."
                    />
                    {commentText.length > 0 && commentText.length < 2 && (
                        <p className="text-sm text-red-500 mt-1">댓글은 최소 2자 이상 입력해주세요.</p>
                    )}
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={commentText.length < 2}
                            className={`px-4 py-2 rounded transition-colors ${commentText.length >= 2
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            댓글 작성
                        </button>
                    </div>
                </form>

                {/* 댓글 목록 */}
                <div className="space-y-4">
                    {/* 초기 로딩 - 상단 스켈레톤 */}
                    {commentsLoading && (
                        <>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <SkeletonComment key={`skeleton-comment-top-${i}`} />
                            ))}
                        </>
                    )}

                    {/* 댓글 렌더링 */}
                    {!commentsLoading && allComments.map((comment: any) => (
                        <div key={comment.id} className="p-4 border-b border-gray-200">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                    {comment.author?.name?.[0] || 'U'}
                                </div>
                                <div>
                                    <p className="font-medium">{comment.author?.name || '익명'}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    ))}

                    {/* 추가 로딩 - 하단 스켈레톤 */}
                    {isFetchingNextPage && (
                        <>
                            {Array.from({ length: 2 }).map((_, i) => (
                                <SkeletonComment key={`skeleton-comment-bottom-${i}`} />
                            ))}
                        </>
                    )}

                    {!commentsLoading && allComments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
                        </div>
                    )}
                </div>

                {/* Intersection Observer 타겟 */}
                <div ref={observerRef} className="h-10" />
            </div>
        </div>
    );
};

export default LpDetailPage;
