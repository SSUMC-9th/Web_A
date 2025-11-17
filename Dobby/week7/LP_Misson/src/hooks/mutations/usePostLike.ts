import { useMutation } from "@tanstack/react-query";
import { postLpLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseMyInfoDto } from "../../types/auth";
import type { Like, ResponseLpDetailDto } from "../../types/lp";

function usePostLike() {
  return useMutation({
    mutationFn: postLpLike,
    onMutate: async (lpId: number) => {
      // 상세 쿼리 키와 동일하게 맞춘다
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lp, lpId] });
      const previousLpPost = queryClient.getQueryData<ResponseLpDetailDto>([QUERY_KEY.lp, lpId]);
      const newLpPost = { ...previousLpPost };
      const me = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);
      const userId = Number(me?.data.id);
      const likedIndex =
        previousLpPost?.data.likes.findIndex((like) => like.userId === userId) ?? -1;
      if (likedIndex >= 0) {
        previousLpPost?.data.likes.splice(likedIndex, 1);
      } else {
        const newLike = { userId, lpId } as Like;
        previousLpPost?.data.likes.push(newLike);
      }
      queryClient.setQueryData([QUERY_KEY.lp, lpId], newLpPost);
      return { previousLpPost, newLpPost };
    },
    onError: (err, lpId) => {
      console.error(err, lpId);
      // 실패 시 상세 캐시 무효화
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, lpId as number] });
    },
    onSettled: async (data, error, variables) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, variables as number] });
      // 목록 캐시도 사용 중이라면 함께 무효화
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, variables as number] });
    },
  });
}

export default usePostLike;
