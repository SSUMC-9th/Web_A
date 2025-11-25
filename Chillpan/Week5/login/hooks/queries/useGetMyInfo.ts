import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";

function useGetMyInfo(enabled = true) {
  return useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    staleTime: 1000 * 60 * 5,
    enabled,
    retry: false,
  });
}

export default useGetMyInfo;
