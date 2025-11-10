import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpListClient } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList(params : PaginationDto) {
    return useQuery({
        queryKey: [QUERY_KEY.lps, params],
        queryFn:() =>
            getLpListClient(params),
            staleTime: 5 * 60 * 1_000,  // 5분
            gcTime: 10 * 60 * 1000,      // 10분
            
    });
}

export default useGetLpList;