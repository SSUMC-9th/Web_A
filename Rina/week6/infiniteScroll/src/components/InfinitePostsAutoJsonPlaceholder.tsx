import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

// 1. 타입과 상수는 동일
interface Post {
    id: number;
    title: string;
    body: string;
}

const PAGE_SIZE=  10;

// 2. fetch 함수도 동일
async function fetchPosts({ pageParam = 1 }: { pageParam?: number}) {
    const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${PAGE_SIZE}`
    );
    if (!res.ok) throw new Error('네트워크 에러');
    return (await res.json()) as Post[];
}

export default function InfinitePostsAutoJsonPlaceholder() {
    // 3. useInfiniteQuery 사용 (이전과 동일)
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['posts', PAGE_SIZE],
        queryFn: ({ pageParam}) => fetchPosts({ pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length < PAGE_SIZE ? undefined : allPages.length + 1,
    });

    // 4. 센티널 요소를 참조하기 위한 ref
    //    useRef는 특정 DOM 요소를 직접 접근할 때 사용
    const sentineRef = useRef<HTMLDivElement | null>(null);

    // 5. Intersection Observer 설정
    useEffect(() => {
        // 센티널 요소가 없으면 아무것도 안 함
        if (!sentineRef.current) return;

        const el = sentineRef.current;

        // IntersectionObserver 생성
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];

            // 요소가 화면에 보이고,, 다음 페이지가 있고,, 현재 로딩 중이 아니면
            if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();    // 조건 만족하면 다음 페이지 불러오기
            }
        });

        // 센티널 요소 관찰 시작
        observer.observe(el);

        // 컴포넌트가 언마운트 되면 관찰 중지
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
    // 의존성 배열 :  이 값들이 바뀌면 useEffect가 다시 실행됨

    // 6. 렌더링
    return (
        <div>
            {/* 데이터 표시 */}
            {data?.pages.map((page, idx) => (
                <ul key={idx} style={{marginBottom: 16}}>
                    {page.map((post) => (
                        <li key={post.id}>
                            <strong>#{post.id}</strong> {post.title}
                        </li>
                    ))}
                </ul>
            ))}

            {/* 7. 센티널 요소 (스크롤 감지용) */}
            {/*     높이 1px의 보이지 않는 div */}
            <div ref={sentineRef} style={{height: 1 }} />

            {/* 8. 상태 메시지 */}
            <div>
                {isFetchingNextPage
                    ? '불러오는 중....'
                    : hasNextPage
                    ? '아래로 스크롤 하면 더 가져옴'
                    : '더 이상 데이터가 없음'}
            </div>
        </div>
    )

}