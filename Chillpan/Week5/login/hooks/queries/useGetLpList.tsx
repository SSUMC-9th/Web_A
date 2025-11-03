import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../src/types/common.ts";
import { getLpList } from "../../apis/lp.ts";
import { QUERY_KEY } from "../../constants/key.ts";

//useQuery를 통해 mypage -> home으로 이동시 데이터 호출 발생 X
function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
  const sort = order; // order를 sort로 (가독성)

  return useQuery({
    queryKey: [QUERY_KEY.lps, sort, search], // sort와 search를 queryKey에 포함하여 변경 시 자동 리패치
    queryFn: () =>
      getLpList({
        cursor,
        search,
        order,
        limit,
      }),
    staleTime: 1000 * 60 * 5, // 5분동안 기존 데이터 그대로 사용
    gcTime: 1000 * 60 * 10, // 10분
    //refetchInterval: 1000 * 60 * 0.1, // 0.1분마다 데이터 호출
  });
}

export default useGetLpList;
