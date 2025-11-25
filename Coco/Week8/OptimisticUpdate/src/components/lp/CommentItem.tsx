// components/lp/CommentItem.tsx
import { useState } from 'react';
import { useUpdateComment, useDeleteComment } from '../../hooks/useCommentMutations';
import type { Comment } from '../../types/lp.types';

interface CommentItemProps {
  comment: Comment;
  lpId: string;
  isOwner: boolean;
}

export const CommentItem = ({ comment, lpId, isOwner }: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);

  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(lpId);
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(lpId);

  const handleUpdate = () => {
    if (editText.trim().length < 2) {
      alert('최소 2자 이상 입력해주세요.');
      return;
    }

    updateComment(
      { commentId: comment.id, content: editText },
      {
        onSuccess: () => {
          setIsEditing(false);
          setShowMenu(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteComment(comment.id);
    }
  };

  return (
    <div className="border-b border-gray-200 pb-4 relative">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">{comment.userName}</span>
          <span className="text-sm text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>

        {/* 메뉴 버튼 (본인 댓글만) */}
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-500 hover:text-gray-700 px-2"
            >
              ⋯
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  {isDeleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 수정 모드 */}
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-300"
            >
              {isUpdating ? '저장 중...' : '저장'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditText(comment.content);
              }}
              className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700">{comment.content}</p>
      )}
    </div>
  );
};