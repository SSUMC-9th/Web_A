import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";

export const useInfiniteLpList = ({ limit = 20, search, order }: PaginationDto) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, "infinite", search ?? "", order ?? "desc", limit],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getLpList({
        cursor: pageParam as number,
        limit,
        search,
        order,
      }),
    getNextPageParam: (lastPage) => (lastPage?.hasNext ? lastPage.nextCursor : undefined),
  });
};

export default useInfiniteLpList;
