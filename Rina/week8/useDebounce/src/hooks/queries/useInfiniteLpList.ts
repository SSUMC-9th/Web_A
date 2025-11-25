import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getLpListClient } from "../../apis/lp";
import type { PAGINATION_ORDER } from "../../enums/common";

type Params = {
    sort: PAGINATION_ORDER;
    limit?: number;
    search?: string;
    enabled?: boolean;
}

export default function useInfiniteLpList({ sort, limit = 30, search, enabled = true }: Params){
    const trimmed = (search?? "").trim();
    const hasQuery = trimmed.length > 0;
    const searchParam = hasQuery ? trimmed : undefined; // 검색어 없으면 undefined

    return useInfiniteQuery({
        queryKey: [QUERY_KEY.lps, sort, searchParam ?? "all"],
        enabled,
        queryFn: ({ pageParam }) =>
            getLpListClient({
                order: sort,
                limit,
                search :  searchParam,      // undefined면 기본 리스트, string이면 검색
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