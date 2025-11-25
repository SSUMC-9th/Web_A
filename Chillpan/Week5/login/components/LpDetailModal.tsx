import React, { useCallback, useMemo, useRef, useState } from "react";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetInfiniteLpComments from "../hooks/queries/useGetInfiniteLpComments";
import { PAGINATION_ORDER } from "../enums/common";
import {
  useCreateLpComment,
  useDeleteLpComment,
  useUpdateLpComment,
} from "../hooks/mutations/useLpCommentsMutations";
import {
  useCreateLike,
  useDeleteLike,
} from "../hooks/mutations/useLikesMutations";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../src/context/AuthContext";
import { Heart } from "lucide-react";

interface LpDetailModalProps {
  lpId: number;
  onClose: () => void;
}

const LpDetailModal = ({ lpId, onClose }: LpDetailModalProps) => {
  const {
    data: lpDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetLpDetail(lpId ?? null);

  const {
    data: commentPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCommentLoading,
    isError: isCommentError,
  } = useGetInfiniteLpComments(lpId ?? null, 10, PAGINATION_ORDER.asc);

  const comments = useMemo(
    () =>
      commentPages?.pages
        ?.map((page) => page.data.data)
        ?.flat()
        ?.filter(Boolean) ?? [],
    [commentPages]
  );

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { accessToken } = useAuth();
  const isLoggedIn = Boolean(accessToken);
  const { data: myInfo } = useGetMyInfo(isLoggedIn);
  const currentUserId = myInfo?.data.id;

  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null
  );

  const { mutateAsync: createCommentMutation, isPending: isCreatingComment } =
    useCreateLpComment();
  const { mutateAsync: updateCommentMutation, isPending: isUpdatingComment } =
    useUpdateLpComment();
  const { mutateAsync: deleteCommentMutation, isPending: isDeletingComment } =
    useDeleteLpComment();
  const { mutateAsync: createLikeMutation, isPending: isCreatingLike } =
    useCreateLike();
  const { mutateAsync: deleteLikeMutation, isPending: isDeletingLike } =
    useDeleteLike();

  // 현재 사용자가 좋아요를 눌렀는지 확인
  const isLiked = useMemo(() => {
    if (!lpDetail?.data.likes || !currentUserId) return false;
    return lpDetail.data.likes.some((like) => like.userId === currentUserId);
  }, [lpDetail?.data.likes, currentUserId]);

  const likeCount = lpDetail?.data.likes?.length ?? 0;

  const handleLikeToggle = async () => {
    if (!isLoggedIn || !currentUserId) {
      alert("로그인 후 좋아요를 누를 수 있습니다.");
      return;
    }

    try {
      if (isLiked) {
        await deleteLikeMutation({ lpId, userId: currentUserId });
      } else {
        await createLikeMutation({ lpId, userId: currentUserId });
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      const { scrollTop, scrollHeight, clientHeight } = target;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 120;

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  const handleCreateSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const trimmed = newComment.trim();
    if (!trimmed) {
      return;
    }

    try {
      await createCommentMutation({ lpId, content: trimmed });
      setNewComment("");
    } catch (error) {
      console.error(error);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const startEditComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleUpdateComment = async (commentId: number) => {
    const trimmed = editingContent.trim();
    if (!trimmed) {
      return;
    }

    try {
      await updateCommentMutation({
        lpId,
        commentId,
        content: trimmed,
      });
      setEditingCommentId(null);
      setEditingContent("");
    } catch (error) {
      console.error(error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) {
      return;
    }

    setDeletingCommentId(commentId);
    try {
      await deleteCommentMutation({ lpId, commentId });
    } catch (error) {
      console.error(error);
      alert("댓글 삭제에 실패했습니다.");
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-2xl rounded-lg bg-gray-900 p-6 text-white shadow-lg">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-white"
          aria-label="닫기"
        >
          ×
        </button>

        <div className="space-y-4">
          <div>
            {isDetailLoading ? (
              <p className="text-gray-300">LP 정보를 불러오는 중...</p>
            ) : isDetailError ? (
              <p className="text-red-400">LP 정보를 불러오지 못했습니다.</p>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{lpDetail?.data.title}</h2>
                  <button
                    onClick={handleLikeToggle}
                    disabled={isCreatingLike || isDeletingLike || !isLoggedIn}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
                      isLiked
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                  >
                    <Heart
                      className={`h-5 w-5 transition-all ${
                        isLiked ? "fill-red-400 text-red-400" : ""
                      }`}
                    />
                    <span className="text-sm font-medium">{likeCount}</span>
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-400">
                  {lpDetail?.data.content}
                </p>
              </>
            )}
          </div>

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="max-h-72 overflow-y-auto rounded-md bg-gray-800 p-4"
          >
            <h3 className="text-lg font-semibold">댓글</h3>
            {isLoggedIn ? (
              <form onSubmit={handleCreateSubmit} className="mt-3 space-y-2">
                <textarea
                  value={newComment}
                  onChange={(event) => setNewComment(event.target.value)}
                  placeholder="댓글을 입력하세요"
                  className="h-24 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:border-gray-500 focus:outline-none"
                  disabled={isCreatingComment}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={
                      isCreatingComment || newComment.trim().length === 0
                    }
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isCreatingComment ? "작성 중..." : "댓글 등록"}
                  </button>
                </div>
              </form>
            ) : (
              <p className="mt-3 text-sm text-gray-400">
                로그인 후 댓글을 작성할 수 있습니다.
              </p>
            )}

            {isCommentLoading && (
              <ul className="mt-3 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <li
                    key={`comment-skeleton-${index}`}
                    className="animate-pulse rounded-md bg-gray-900 p-3"
                  >
                    <div className="mb-2 h-4 w-24 rounded bg-gray-700" />
                    <div className="h-3 w-full rounded bg-gray-700" />
                  </li>
                ))}
              </ul>
            )}
            {isCommentError && (
              <p className="mt-3 text-red-400">댓글을 불러오지 못했습니다.</p>
            )}
            {!isCommentLoading && !comments.length && (
              <p className="mt-3 text-gray-400">등록된 댓글이 없습니다.</p>
            )}
            {!!comments.length && (
              <ul className="mt-3 space-y-4">
                {comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="rounded-md bg-gray-900 p-3 shadow"
                  >
                    <div className="text-sm text-gray-400">
                      {comment.author?.name ?? "익명"}
                    </div>
                    {editingCommentId === comment.id ? (
                      <>
                        <textarea
                          value={editingContent}
                          onChange={(event) =>
                            setEditingContent(event.target.value)
                          }
                          className="mt-2 h-24 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-gray-500 focus:outline-none"
                          disabled={isUpdatingComment}
                        />
                        <div className="mt-3 flex justify-end gap-2 text-xs">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-md px-3 py-1 text-gray-300 hover:bg-gray-800"
                            disabled={isUpdatingComment}
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateComment(comment.id)}
                            disabled={
                              isUpdatingComment || editingContent.trim() === ""
                            }
                            className="rounded-md bg-indigo-600 px-3 py-1 text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isUpdatingComment ? "수정 중..." : "수정 완료"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed text-gray-100">
                        {comment.content}
                      </p>
                    )}

                    {currentUserId === comment.authorId && (
                      <div className="mt-3 flex justify-end gap-2 text-xs text-gray-400">
                        {editingCommentId === comment.id ? null : (
                          <button
                            type="button"
                            onClick={() =>
                              startEditComment(comment.id, comment.content)
                            }
                            className="rounded-md px-3 py-1 hover:bg-gray-800"
                            disabled={isUpdatingComment || isDeletingComment}
                          >
                            수정
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="rounded-md px-3 py-1 hover:bg-gray-800"
                          disabled={
                            isDeletingComment &&
                            deletingCommentId === comment.id
                          }
                        >
                          {isDeletingComment && deletingCommentId === comment.id
                            ? "삭제 중..."
                            : "삭제"}
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {isFetchingNextPage && (
              <ul className="mt-4 space-y-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <li
                    key={`comment-fetching-${index}`}
                    className="animate-pulse rounded-md bg-gray-900 p-3"
                  >
                    <div className="mb-2 h-4 w-20 rounded bg-gray-700" />
                    <div className="h-3 w-full rounded bg-gray-700" />
                  </li>
                ))}
              </ul>
            )}
            {!hasNextPage && !!comments.length && !isFetchingNextPage && (
              <p className="mt-4 text-center text-sm text-gray-500">
                더 이상 댓글을 불러올 수 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LpDetailModal;
