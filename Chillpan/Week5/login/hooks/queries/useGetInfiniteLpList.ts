import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: PAGINATION_ORDER
) {
  return useInfiniteQuery({
    queryFn: (
      { pageParam } //  API 호출 함수
    ) => getLpList({ cursor: pageParam, limit, search, order }), // getLpList 함수 호출
    queryKey: [QUERY_KEY.lps, search, order],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      //console.log(lastPage, allPages);
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined; // 다음 페이지가 있으면 다음 페이지 커서 반환, 없으면 undefined 반환
    },
  });
}

export default useGetInfiniteLpList;
