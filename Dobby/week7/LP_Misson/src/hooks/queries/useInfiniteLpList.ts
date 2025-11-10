import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";

function useGetInfiniteLpList(limit: number, search: string, order: PAGINATION_ORDER) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) => getLpList({ cursor: pageParam as number, limit, search, order }),
    queryKey: [QUERY_KEY.lps, search, order],
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      (lastPage as any)?.data?.hasNext
        ? (lastPage as any).data.nextCursor
        : (lastPage as any)?.hasNext
        ? (lastPage as any).nextCursor
        : undefined,
  });
}

export default useGetInfiniteLpList;
