import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/lp";
import { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";

function useGetInfiniteLpComments(
  lpId: number | null,
  limit = 10,
  order: PAGINATION_ORDER = PAGINATION_ORDER.asc
) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lpComments, lpId, limit, order],
    queryFn: ({ pageParam = 0 }) =>
      getLpComments({
        lpId: lpId as number,
        cursor: pageParam,
        limit,
        order,
      }),
    enabled: lpId !== null,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });
}

export default useGetInfiniteLpComments;
