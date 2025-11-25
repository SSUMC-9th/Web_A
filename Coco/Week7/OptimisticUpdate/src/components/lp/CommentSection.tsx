// components/lp/CommentSection.tsx
import { useState } from 'react';
import { useLpComments } from '../../hooks/useLpQueries';
import { useCreateComment } from '../../hooks/useCommentMutations';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { CommentItem } from './CommentItem';
import { CommentSkeleton } from './CommentSkeleton';
import type { SortOrder } from '../../types/lp.types';
import { useAuth } from '../../hooks/useAuth';

interface CommentSectionProps {
  lpId: string;
}

export const CommentSection = ({ lpId }: CommentSectionProps) => {
  const [order, setOrder] = useState<SortOrder>('latest');
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = 
    useLpComments(lpId, order);

  const { mutate: createComment, isPending: isCreating } = useCreateComment(lpId);

  const { ref } = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (commentText.trim().length < 2) {
      return;
    }

    createComment(commentText, {
      onSuccess: () => {
        setCommentText('');
      },
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-2xl font-bold mb-4">댓글</h2>

      {/* 정렬 버튼 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setOrder('latest')}
          className={`px-3 py-1 text-sm rounded ${
            order === 'latest' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          최신순
        </button>
        <button
          onClick={() => setOrder('oldest')}
          className={`px-3 py-1 text-sm rounded ${
            order === 'oldest' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          오래된순
        </button>
      </div>

      {/* 댓글 작성란 */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="댓글을 입력하세요..."
          className="w-full border border-gray-300 rounded-lg p-3 mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          disabled={isCreating}
        />
        {commentText.length > 0 && commentText.trim().length < 2 && (
          <p className="text-red-500 text-sm mb-2">최소 2자 이상 입력해주세요.</p>
        )}
        <button
          type="submit"
          disabled={commentText.trim().length < 2 || isCreating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isCreating ? '작성 중...' : '댓글 작성'}
        </button>
      </form>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)
        ) : (
          <>
            {data?.pages.map((page) =>
              page.items.map((comment) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  lpId={lpId}
                  isOwner={comment.userId === user?.id}
                />
              ))
            )}
            
            {isFetchingNextPage &&
              Array.from({ length: 2 }).map((_, i) => (
                <CommentSkeleton key={`loading-${i}`} />
              ))
            }
          </>
        )}
      </div>

      <div ref={ref} className="h-4" />
    </div>
  );
};