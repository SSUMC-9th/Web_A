import { useMutation } from "@tanstack/react-query";
import { postLpComment } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function usePostComment(lpId: number) {
  return useMutation({
    mutationFn: (content: string) => postLpComment(lpId, content),
    onMutate: async (content: string) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.comments, lpId] });
      const prev = queryClient.getQueryData([QUERY_KEY.comments, lpId]) as
        | { pages: Array<{ data: { data: any[] } }>; pageParams: unknown[] }
        | undefined;
      // optimistic: 현재 목록의 '하단'에 새 댓글 추가(작성 위치와 가깝게 보이도록)
      const newComment = {
        id: Date.now() * -1, // temp id
        userId: -1,
        lpId,
        content,
        createdAt: new Date(),
      };
      const nextPages = prev?.pages ? [...prev.pages] : [];
      if (nextPages.length === 0) {
        nextPages.push({ data: { data: [newComment] } });
      } else {
        const lastIdx = nextPages.length - 1;
        const lastPage = { ...nextPages[lastIdx], data: { ...nextPages[lastIdx].data } };
        const cur = lastPage?.data?.data ?? [];
        lastPage.data.data = [...cur, newComment];
        nextPages[lastIdx] = lastPage;
      }
      queryClient.setQueryData([QUERY_KEY.comments, lpId], { ...prev, pages: nextPages });
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData([QUERY_KEY.comments, lpId], ctx.prev);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.comments, lpId] });
    },
  });
}

export default usePostComment;
