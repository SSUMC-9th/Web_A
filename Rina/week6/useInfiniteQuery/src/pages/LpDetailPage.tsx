import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { getLp } from "../apis/lp";
import { useEffect, useMemo, useRef, useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import { getComments } from "../apis/comment";
import LinesSkeleton from "../components/skeletons/LinesSkeleton";

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
    queryFn: () => getLp(lpid as string),
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

  // root
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setRootEl(document.getElementById("app-scroll") ?? null);
  }, []);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

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
        <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700">수정</button>
        <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700">삭제</button>
        <button className="px-3 py-1 bg-pink-600 hover:bg-pink-500">좋아요</button>
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

        {/* 작성란 - UI만 */}
        <div className="flex gap-2 mb-4">
          <input
            value={cmtValue}
            onChange={(e) => setCmtValue(e.target.value)}
            placeholder="댓글을 입력해주세요"
            className="flex-1 px-3 py-2 rounded bg-gray-900 border border-gray-700 text-gray-200"
          />
          <button
            type="button"
            disabled={!cmtValid}
            className={`px-3 py-2 rounded ${
              cmtValid
                ?  "bg-gray-300 text-gray-900 hover:bg-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            onClick={() => { {/** 아직~ */}}}
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

        {!isCmtPending && !isCmtError && (
          <>
            <ul className="space-y-3">
              {comments.map((c) => (
                <li key={c.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
                    {/* 서버 avatar */}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-300">
                      <span className="font-semibold"> {/*authorName */}</span>
                      <span className="text-gray-500 ml-2">
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-200">{c.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            {isFetchingNextPage && <LinesSkeleton lines={6} className="mt-4" />}
            <div ref={sentinelRef} className="h-8" />
            {!hasNextPage && comments.length >0 && (
              <div className="text-center text-gray-500 py-4">마지막 댓글</div>
            )}
          </>
        )}
      </section>
      
    </article>
  );
}
