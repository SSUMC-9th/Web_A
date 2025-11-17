import { useEffect, useMemo, useRef, useState } from "react";
import usePostComment from "../hooks/mutations/usePostComment";
import useInfiniteComments from "../hooks/queries/useInfiniteComments";
import SkeletonComment from "./SkeletonComment";

type Props = { lpId: number };

const CommentsSection = ({ lpId }: Props) => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteComments(lpId, { limit: 20 });
  const { mutate: postComment, isPending } = usePostComment(lpId);
  const [value, setValue] = useState("");

  const comments = useMemo(() => {
    return (
      data?.pages.flatMap(
        (p: {
          data?: {
            data?: Array<{ id: number; userId: number; createdAt: string; content: string }>;
          };
        }) => p?.data?.data ?? []
      ) ?? []
    );
  }, [data]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const t = sentinelRef.current;
    if (!t) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(t);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    postComment(value.trim());
    setValue("");
  };

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-3">댓글</h2>
      {isLoading && (
        <div className="divide-y divide-zinc-800">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonComment key={i} />
          ))}
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <ul className="divide-y divide-zinc-800">
            {comments.map(
              (c: { id: number; userId: number; createdAt: string | Date; content: string }) => (
                <li key={c.id} className="py-3">
                  <div className="text-xs text-zinc-400 mb-1">
                    사용자 #{c.userId} · {new Date(c.createdAt).toLocaleString()}
                  </div>
                  <div className="text-sm">{c.content}</div>
                </li>
              )
            )}
          </ul>
          <div ref={sentinelRef} className="h-6" />
          {isFetchingNextPage && (
            <div className="mt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonComment key={`next-${i}`} />
              ))}
            </div>
          )}
          {/* 입력창을 목록 하단으로 이동 */}
          <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
            <input
              className="flex-1 h-10 px-3 rounded-md bg-zinc-900 border border-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="댓글을 입력하세요"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={isPending || !value.trim()}
              className="h-10 px-3 rounded-md bg-pink-600 hover:bg-pink-500 disabled:bg-pink-700/50"
            >
              등록
            </button>
          </form>
        </>
      )}
    </section>
  );
};

export default CommentsSection;
