import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";

export const useInfiniteLpList = ({ limit, search, order }: PaginationDto) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, order ?? "desc"],
    initialPageParam: 0 as number,
    queryFn: ({ pageParam }) => {
      return getLpList({ limit, search, order, cursor: pageParam });
    },
    // 예시 구조와 유사하게 nextCursor를 우선 사용하고, 없으면 중단
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  });
};

export default useInfiniteLpList;
