import { useInfiniteQuery, type QueryKey } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { PAGINATION_ORDER } from "../../enums/common";
import type { ResponseLpListDto } from "../../types/lp";

function useGetInfiniteLpList(limit: number, search: string, order: PAGINATION_ORDER) {
  return useInfiniteQuery<ResponseLpListDto, unknown, ResponseLpListDto, QueryKey, number>({
    queryFn: ({ pageParam }) => getLpList({ cursor: pageParam as number, limit, search, order }),
    queryKey: [QUERY_KEY.lps, search, order],
    initialPageParam: 0,
    retry: false,
    getNextPageParam: (lastPage) =>
      lastPage?.data?.hasNext ? lastPage.data.nextCursor : undefined,
  });
}

export default useGetInfiniteLpList;
