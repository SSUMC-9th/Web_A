// pages/LpDetailPage.tsx
import { useParams } from 'react-router-dom';
import { useLpDetail } from '../hooks/useLpQueries';
import { useLikeLp } from '../hooks/useLpMutations';
import { CommentSection } from '../components/lp/CommentSection';
import { SkeletonCard } from '../components/common/SkeletonCard';

export const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const { data: lp, isLoading, isError } = useLpDetail(lpId!);
  const { mutate: toggleLike, isPending: isLiking } = useLikeLp(lpId!);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <SkeletonCard />
      </div>
    );
  }

  if (isError || !lp) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-red-600">게시글을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 썸네일 */}
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-96 object-cover rounded-lg mb-6"
      />

      {/* 헤더 정보 */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow">
        <h1 className="text-3xl font-bold mb-4">{lp.title}</h1>
        
        <div className="flex items-center gap-6 text-gray-600 mb-4">
          <span>{new Date(lp.uploadDate).toLocaleDateString()}</span>
          <span className="flex items-center gap-1">
            ❤️ {lp.likes}
          </span>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={() => toggleLike()}
            disabled={isLiking}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            ❤️ 좋아요
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            수정
          </button>
          <button className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50">
            삭제
          </button>
        </div>
      </div>

      {/* 본문 */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow">
        <div className="prose max-w-none">
          {lp.content}
        </div>
      </div>

      {/* 댓글 섹션 */}
      <CommentSection lpId={lpId!} />
    </div>
  );
};