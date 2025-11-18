import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getLpListClient } from "../../apis/lp";
import type { PAGINATION_ORDER } from "../../enums/common";

type Params = {
    sort: PAGINATION_ORDER;
    limit?: number;
    search?: string;
}

export default function useInfiniteLpList({ sort, limit = 30, search}: Params){
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.lps, sort],
        queryFn: ({ pageParam }) =>
            getLpListClient({
                order: sort,
                limit,
                search,
                cursor: (pageParam as number | undefined) ?? undefined,
            }),
            initialPageParam: undefined as number | undefined,
            getNextPageParam: (lastPage) =>
                lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
    });
}