import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpDetail(lpId: number | null) {
  return useQuery({
    queryKey: [QUERY_KEY.lpDetail, lpId],
    queryFn: () => getLpDetail(lpId as number),
    enabled: lpId !== null,
    staleTime: 1000 * 60,
  });
}

export default useGetLpDetail;
