import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { deleteLp, getLpDetail } from "../apis/lp";
import { useEffect, useMemo, useRef, useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import { deleteComment, getComments, patchComment, postComment } from "../apis/comment";
import LinesSkeleton from "../components/skeletons/LinesSkeleton";
import { useAuth } from "../context/AuthContext";
import { QUERY_KEY } from "../constants/key";
import LPModal from "../components/modals/LPModal";
import type { Likes, LpDetailClient } from "../types/lp";
import { api, type ApiError } from "../apis/axios";
import { getMyInfo } from "../apis/auth";
import type { CommonResponse } from "../types/common";

type LikeCtx = {prev?: LpDetailClient};

export default function LpDetailPage() {
  const { lpid } = useParams<{lpid: string}>();
  const validId = !!lpid;

  // order를 url 쿼리로 관리 -> queryKey에 반영되고 첫 페이지부터 재로딩
  const [searchParams, setSearchParams ] = useSearchParams();
  const orderParam = searchParams.get("order");
  const order : PAGINATION_ORDER = 
  orderParam === PAGINATION_ORDER.asc ? PAGINATION_ORDER.asc : PAGINATION_ORDER.desc;

  const setOrderByRoute = (next: PAGINATION_ORDER) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("order", next);
    setSearchParams(nextParams, {replace: true});
  };

  const limit = 20;

  const {
    data: lp,
    isPending: isLpPending,
    isError: isLpError,
    refetch: refetchLp,
    isFetching: isLpFetching,
  } = useQuery({
    queryKey: ["lp", lpid ],
    queryFn: () => getLpDetail({lpid : Number(lpid)}),
    enabled: validId,
    staleTime: 60 * 1000,
  });

  const LpSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-2/3 bg-gray-600 rounded" />
      <div className="h-4 w-40 bg-gray-600 rounded" />
      <div className="h-72 w-full bg-gray-600 rounded" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-600 rounded" />
        <div className="h-4 w-11/12 bg-gray-600 rounded" />
        <div className="h-4 w-10/12 bg-gray-600 rounded" />
        <div className="h-4 w-9/12 bg-gray-600 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-20 bg-gray-600 rounded" />
        <div className="h-9 w-20 bg-gray-600 rounded" />
        <div className="h-9 w-20 bg-gray-600 rounded" />
      </div>
    </div>
  );

  // 댓글
  const {
    data: cmtPages,
    isPending: isCmtPending,
    isError: isCmtError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchComments,
  } = useInfiniteQuery({
    queryKey: ["lpComments", lpid, order],
    queryFn: ({pageParam }) =>
      getComments(lpid as string, {
        order, limit, cursor: (pageParam as number | undefined) ?? undefined,
      }),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) => 
        lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
      staleTime: 60 * 1000, // 1분
      refetchOnWindowFocus: false,
      enabled: validId,
  });

  const comments = useMemo(
    () => (cmtPages ? cmtPages.pages.flatMap((p) => p.data) : []),
    [cmtPages]
  );

  const {data: meRes} = useQuery({
    queryKey: ["me"],
    queryFn: getMyInfo,
    staleTime: 60_000,
  });
  const meId: number | null = (meRes?.data?.id ?? null) as number | null;

  
  // 댓글 작성(생성) mutation
  const qc = useQueryClient();
  const {userName} = useAuth();

  const createCmtMuta = useMutation({
    mutationFn: (content: string) => postComment(lpid as string, {content}),
    onSuccess: async() => {
      setCmtValue("");
      await qc.invalidateQueries({queryKey: ["lpComments", lpid, order]});
    },
  });

  //수정, 삭제를 위해 로컬 편집 상태
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const editCmtMuta = useMutation({
    mutationFn: () => patchComment(lpid as string, editingId!, editingText),
    onSuccess: async() => {
      setEditingId(null);
      setEditingText("");
      await qc.invalidateQueries({ queryKey: ["lpComments", lpid, order]})
    },
  });

  const deleteCmtMuta = useMutation({
    mutationFn: (cid: number) => deleteComment(lpid as string, cid),
    onSuccess: async() => {
      await qc.invalidateQueries({ queryKey: ["lpComments", lpid, order]})
    }
  });


  // root
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setRootEl(document.getElementById("app-scroll") ?? null);
  }, []);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 상태
  const [editOpen, setEditOpen] = useState(false);
  const qc2 = useQueryClient();

  const delMut = useMutation({
    mutationFn: () => deleteLp(Number(lpid)),
    onSuccess: async () => {
      await qc2.invalidateQueries({queryKey: [QUERY_KEY.lps]});
      window.history.back(); // 목록으로
    },
  });

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    let cooling = false;
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      console.log('IO hit', { isIntersecting: entry.isIntersecting, hasNextPage, isFetchingNextPage });
      if (!entry.isIntersecting) return;
      if (!hasNextPage || isFetchingNextPage) return;
      if (cooling) return;

      cooling = true;
      fetchNextPage();
      setTimeout(() => (cooling = false), 200);
    },
    {
      root: rootEl ?? undefined,
      rootMargin: "0px 0px 300px 0px",
      threshold: 0,
    }
  );
    io.observe(el);
    return () => io.disconnect();
  }, [ rootEl, hasNextPage, isFetchingNextPage, fetchNextPage]);


  // 좋아요
  const likedByMe = useMemo(() => {
    if (!lp || !meId) return false;
    return lp.likesList.some(lk => lk.userId === meId);
  }, [lp, meId]);

  // 좋아요 추가
  const addLikeMuta = useMutation<CommonResponse<Likes>, ApiError, void, LikeCtx>({
    mutationFn: async () => {
      if (!meId) throw new Error("Unauthorized");
      return api
        .post(`/v1/lps/${lpid}/likes`, {}, { withAuth: true })
        .then(r => r.data as CommonResponse<Likes>);
    },

    onMutate: async (): Promise<LikeCtx> => {
      await qc2.cancelQueries({ queryKey: ["lp", lpid] });
      const prev = qc2.getQueryData<LpDetailClient>(["lp", lpid]);

      if (prev && meId) {
        const next: LpDetailClient = {
          ...prev,
          likes: prev.likes + 1,
          likesList: [...prev.likesList,
            { id: -Date.now(), userId: meId, lpId: Number(lpid) }],
        };
        qc2.setQueryData(["lp", lpid], next);
      }
      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc2.setQueryData(["lp", lpid], ctx.prev);
    },

    onSettled: () => {
      qc2.invalidateQueries({ queryKey: ["lp", lpid] });
    },
  });

  // 좋아요 삭제
  const removeLikeMuta = useMutation<CommonResponse<Likes>, ApiError, void, LikeCtx>({
    mutationFn: async () => {
      if (!meId) throw new Error("Unauthorized");
      return api
        .delete(`/v1/lps/${lpid}/likes`, { withAuth: true })
        .then(res => res.data as CommonResponse<Likes>);
    },

    onMutate: async (): Promise<LikeCtx> => {
      await qc2.cancelQueries({ queryKey: ["lp", lpid] });

      const prev = qc2.getQueryData<LpDetailClient>(["lp", lpid]);

      if (prev && meId) {
        const next: LpDetailClient = {
          ...prev,
          likes: Math.max(0, prev.likes - 1),
          likesList: prev.likesList.filter(lk => lk.userId !== meId),
        };

        qc2.setQueryData(["lp", lpid], next);
      }

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc2.setQueryData(["lp", lpid], ctx.prev);
    },

    onSettled: () => {
      qc2.invalidateQueries({ queryKey: ["lp", lpid] });
    },
  });

  // 컨텐츠가 짧아 화면을 못 채울 때 초기에 한번 밀어주기??
  useEffect(() => {
    if (isCmtPending || isFetchingNextPage || !hasNextPage) return;

    const tryKick = () => {
      const scrollEl = rootEl ?? (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
      const nearBottom = scrollEl.scrollHeight - scrollEl.clientHeight <= 450;
      if (nearBottom) fetchNextPage();
    };

    const id = setTimeout(tryKick, 0);
    return () => clearTimeout(id);
  }, [rootEl, isCmtPending, isFetchingNextPage, hasNextPage, fetchNextPage]);

  
  // 댓글 작성란 (UI)
  const [cmtValue, setCmtValue ] = useState("");
  const cmtValid = cmtValue.trim().length > 0;
  
  if (!lpid) return <div className="text-gray-400">잘못된 접근입니다.</div>;
  
  // 데이터가 생기기 전엔(또는 로딩 중엔) 스켈레톤 고정
  const showSkeleton = !lp || isLpPending || (isLpFetching && !lp);
  if (showSkeleton) return <LpSkeleton />;

  if (isLpError)
    return (
      <div className="text-center text-gray-400">
        불러오기 실패...{" "}
        <button onClick={() => refetchLp()} className="underline">재시도</button>
      </div>
    );


  
  return (
    <article>
      <header>
        <h1 className="text-3xl font-extrabold">{lp.title}</h1>
        <p>{new Date(lp.createdAt).toLocaleString()} · ❤ {lp.likes}</p>
      </header>

      {lp.thumbnailUrl && (
        <div className="rounded bg-gray-800 p-4 mb-6">
          <img src={lp.thumbnailUrl} alt={lp.title} className="mx-auto rounded shadow max-h-96 md:max-h-[28rem] object-contain" />
        </div>
      )}

      <section className="prose prose-invert max-w-none">
        <p>{lp.body}</p>
      </section>

      <footer className="mt-8 flex gap-3">
        <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700"
          onClick={() => setEditOpen(true)}>
          수정</button>
        <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700"
          onClick={() => delMut.mutate()} disabled={delMut.isPending}>
          삭제</button>
        <button className="px-3 py-1 bg-pink-600 hover:bg-pink-500"
          onClick={() => {
            if (!meId) {
              alert("로그인이 필요합니다.");
              return;
            }
            if (likedByMe) removeLikeMuta.mutate();
            else addLikeMuta.mutate();
          }}
          >
            {likedByMe ? "좋아요 취소" : "좋아요"}
          </button>
      </footer>

      {/* 댓글 */}
      <section className="mt-10 bg-gray-800/70 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">댓글</h2>
          <div className="inline-flex gap-2">
            <button
              onClick={() => setOrderByRoute(PAGINATION_ORDER.desc)}
              className={[
                "px-3 py-1 rounded border",
                order === PAGINATION_ORDER.desc
                  ? "bg-white text-gray-900 border-white"
                  : "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600",
              ].join(" ")}
            >
              최신순
            </button>
            <button
              onClick={() => setOrderByRoute(PAGINATION_ORDER.asc)}
              className={[
                "px-3 py-1 rounded border",
                order === PAGINATION_ORDER.asc
                  ? "bg-white text-gray-900 border-white"
                  : "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600",
              ].join(" ")}
            >
              오래된순
            </button>
          </div>
        </div>

        {/* 댓글 작성란  */}
        <div className="flex gap-2 mb-4">
          <input
            value={cmtValue}
            onChange={(e) => setCmtValue(e.target.value)}
            placeholder="댓글을 입력해주세요"
            className="flex-1 px-3 py-2 rounded bg-gray-900 border border-gray-700 text-gray-200"
          />
          <button
            type="button"
            disabled={!cmtValid || createCmtMuta.isPending}
            className={`px-3 py-2 rounded ${
              cmtValid
                ?  "bg-gray-300 text-gray-900 hover:bg-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            onClick={() => createCmtMuta.mutate(cmtValue.trim())}
          >
            작성
          </button>
        </div>

        {/* 댓글 목록 */}
        {isCmtPending && <LinesSkeleton lines={8} /> }

        {isCmtError && !isCmtPending && (
          <div className="text-center text-gray-400">
            댓글을 불러오지 못했습니다...{" "}
            <button onClick={() => refetchComments()} className="underline">
              재시도
            </button>
          </div>
        )}

        {comments.map((c) => {
          const mine = userName && c.authorName && userName === c.authorName;
          const isEditing = editingId === c.id;

          return (
            <li key={c.id} className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300">
                    <span className="font-semibold">{c.authorName}</span>
                    <span className="text-gray-500 ml-2">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  {mine && (
                    <div className="opacity-0 group-hover:opacity-100 transition">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            className="text-sm px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
                            onClick={() => editCmtMuta.mutate()}
                            disabled={editCmtMuta.isPending || editingText.trim().length === 0}
                          >저장</button>
                          <button className="text-sm px-2 py-1 rounded hover:bg-gray-800" onClick={() => setEditingId(null)}>취소</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            className="text-sm px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
                            onClick={() => { setEditingId(c.id); setEditingText(c.body); }}
                          >수정</button>
                          <button
                            className="text-sm px-2 py-1 rounded bg-gray-700 hover:bg-red-600"
                            onClick={() => deleteCmtMuta.mutate(c.id)}
                            disabled={deleteCmtMuta.isPending}
                          >삭제</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="mt-2 w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-gray-200"
                  />
                ) : (
                  <p className="text-gray-200">{c.body}</p>
                )}
              </div>
            </li>
          );
        })}

      </section>
      
      <LPModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        editTargetId={Number(lpid)}
        initial={{
          title: lp.title,
          content: lp.body,
          tags: lp.tags.map(t => t.name ?? ""),
          thumbnail: lp.thumbnailUrl,
        
        }}
      />
      
    </article>
  );
}
