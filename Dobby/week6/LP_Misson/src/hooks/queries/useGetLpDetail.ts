import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";

export const useGetLpDetail = (lpId: number) => {
    return useQuery({
        queryKey: ["lp", lpId],
        queryFn: () => getLpDetail(lpId),
        enabled: !!lpId,
        staleTime: 1000 * 60 * 5,
    });
};

export default useGetLpDetail;


