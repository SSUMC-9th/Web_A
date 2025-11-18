import { useInfiniteQuery } from "@tanstack/react-query";

// 1. 데이터 인터페이스 정의
// TypeScript를 쓰면 자동완성이 되고 오타를 방지할 수 있음
interface Post {
    id: number;
    title: string;
    body: string;
};

// 2. 한 번에 가져올 게시글 개수
const PAGE_SIZE = 10;

// 3. 데이터 가져오는 함수
//      pageParam : 현재 페이지 번호(1, 2, 3, ...)
async function fetchPosts({ pageParam = 1 } : {pageParam?: number}) {
    const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${PAGE_SIZE}`
    );

    if (!res.ok) {
        throw new Error('네트워크 에러');
    }
    return (await res.json())as Post[];
}

// 4. 메인 컴포넌트
export default function InfinitePostsJsonPlaceholder() {
    // 5. useInfiniteQuery 훅 사용
    const {
        data,                   // 지금까지 불러온 모든 데이터
        error,                  // 에러를 여기에 담음
        isLoading,              // 처음 로딩 중인지
        fetchNextPage,          // 다음 페이지 불러오는 함수
        hasNextPage,            // 다음 페이지가 있는지
        isFetchingNextPage,     // 다음 페이지 로딩 중인지
        status,                 // 전체 상태('loading', 'error', 'success')
    } = useInfiniteQuery({
        // 자세한 코드 해석은.. ch6 무한 스크롤 실습 노션 보기..
        queryKey: ['posts', PAGE_SIZE],
        queryFn: ({ pageParam}) => fetchPosts ({ pageParam }),
        initialPageParam : 1,
        getNextPageParam: (lastPage, allPages) => {
            const isLast = lastPage.length < PAGE_SIZE;
            return isLast ? undefined : allPages.length + 1;
        },
    });

    // 6. 로딩 상태 처리
    if (isLoading) {
        return <div>로딩 중.......</div>;
    }

    // 7. 에러 상태 처리
    if (error) {
        return <div>에러 발생.......: {error.message}</div>;
    }

    // 8. 데이터 렌더링
    return (
        <div>
            {/* data.pages는 배열의 배열 */}
            {/* ex. [[post1~10], [post11~20], [post21~30]] */}
            {data?.pages.map((page, pageIndex) => (
                <ul
                    key={pageIndex}
                    style={{marginBottom: 16}}
                >
                    {page.map((post) => (
                        <li key={post.id}>
                            <strong>#{post.id}</strong> {post.title}
                        </li>
                    ))}
                </ul>
            ))}

            {/* 9. 더보기 버튼 */}
            <div>
                {hasNextPage ? (
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage ? '불러오는 중......' : '더 보기'}
                    </button>
                ) : (
                    <span>마지막 페이지</span>
                )}
            </div>
            
            {/* 10. 디버깅용 상태 표시 */}
            <div
                style={{marginTop: 8, fontSize: 12, color: '#555'}}
            >
                상태 : {status} / 다음 페이지 가능 : {String(!!hasNextPage)}
            </div>

        </div>
    )
}