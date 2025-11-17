import { useMutation } from "@tanstack/react-query";
import { deleteLpLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseMyInfoDto } from "../../types/auth";
import type { Like, ResponseLpDetailDto } from "../../types/lp";

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLpLike,
    onMutate: async (lpId: number) => {
      // 상세 쿼리 키와 동일하게 맞춘다
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lp, lpId] });
      // 현재 게시글의 데이터를 캐시에서 가져와야 함
      const previousLpPost = queryClient.getQueryData<ResponseLpDetailDto>([QUERY_KEY.lp, lpId]);
      //게시글 데이터 복사, NewLpPost라는 새로운 객체 만들기
      //복사 -> 나중에 오류가 발생했을 때 이전 상태로 되돌리기 위해서 이다.
      const newLpPost = { ...previousLpPost };
      //게시글에 저장된 좋아요 목록에서 현재 내가 눌렀던 좋아요의 위치를 찾아야 한다.
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

      //업데이트된 게시글 데이터를 캐시에 저장
      // 이렇게 하면 UI 바로 업데이트, 변화 확인 가능
      queryClient.setQueryData([QUERY_KEY.lp, lpId], newLpPost);
      return { previousLpPost, newLpPost };
    },
    onError: (err, lpId) => {
      console.error(err, lpId);
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, lpId as number] });
    },
    onSettled: async (data, error, variables) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, variables as number] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, variables as number] });
    },
  });
}

export default useDeleteLike;
