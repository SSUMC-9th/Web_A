import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";

export const useLpList = ({ limit = 40, search, order }: PaginationDto) => {
    return useQuery({
        queryKey: [QUERY_KEY.lps, order ?? "desc", search ?? ""],
        queryFn: () => getLpList({ limit, search, order }),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

export default useLpList;


