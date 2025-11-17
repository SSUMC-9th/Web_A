import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";

export const useInfiniteComments = (lpId: number, { limit = 20 }: PaginationDto = {}) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.comments, lpId],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getLpComments(lpId, { cursor: pageParam as number, limit }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    enabled: !!lpId,
    staleTime: 1000 * 60 * 5,
  });
};

export default useInfiniteComments;
