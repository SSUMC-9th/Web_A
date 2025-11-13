import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLike, deleteLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { LpDetail, Lp } from "../../src/types/lp";
import type { ResponseLpListDto } from "../../src/types/lp";

export function useCreateLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, userId }: { lpId: number; userId: number }) =>
      createLike(lpId),
    onMutate: async ({ lpId, userId }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lpDetail, lpId],
      });

      // 이전 값 저장 (롤백용)
      const previousLpDetail = queryClient.getQueryData<{
        data: LpDetail;
      }>([QUERY_KEY.lpDetail, lpId]);

      // 낙관적 업데이트: 좋아요 추가
      if (previousLpDetail) {
        queryClient.setQueryData<{ data: LpDetail }>(
          [QUERY_KEY.lpDetail, lpId],
          (old) => {
            if (!old) return old;
            // 이미 좋아요가 있는지 확인
            const alreadyLiked = old.data.likes.some(
              (like) => like.userId === userId
            );
            if (alreadyLiked) return old;

            return {
              ...old,
              data: {
                ...old.data,
                likes: [
                  ...old.data.likes,
                  {
                    id: Date.now(), // 임시 ID
                    userId: userId,
                    lpId: lpId,
                  },
                ],
              },
            };
          }
        );
      }

      // LP 리스트도 업데이트
      queryClient.setQueriesData<{
        pages: ResponseLpListDto[];
      }>({ queryKey: [QUERY_KEY.lps] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              data: page.data.data.map((lp: Lp) => {
                if (lp.id === lpId) {
                  const alreadyLiked = lp.likes.some(
                    (like) => like.userId === userId
                  );
                  if (alreadyLiked) return lp;
                  return {
                    ...lp,
                    likes: [
                      ...lp.likes,
                      {
                        id: Date.now(),
                        userId: userId,
                        lpId: lpId,
                      },
                    ],
                  };
                }
                return lp;
              }),
            },
          })),
        };
      });

      return { previousLpDetail };
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 롤백
      if (context?.previousLpDetail) {
        queryClient.setQueryData(
          [QUERY_KEY.lpDetail, variables.lpId],
          context.previousLpDetail
        );
      }
    },
    onSettled: (data, error, variables) => {
      // 성공/실패 관계없이 쿼리 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpDetail, variables.lpId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
  });
}

export function useDeleteLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, userId }: { lpId: number; userId: number }) =>
      deleteLike(lpId),
    onMutate: async ({ lpId, userId }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lpDetail, lpId],
      });

      // 이전 값 저장 (롤백용)
      const previousLpDetail = queryClient.getQueryData<{
        data: LpDetail;
      }>([QUERY_KEY.lpDetail, lpId]);

      // 낙관적 업데이트: 좋아요 제거
      if (previousLpDetail) {
        queryClient.setQueryData<{ data: LpDetail }>(
          [QUERY_KEY.lpDetail, lpId],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              data: {
                ...old.data,
                likes: old.data.likes.filter(
                  (like) => like.userId !== userId
                ),
              },
            };
          }
        );
      }

      // LP 리스트도 업데이트
      queryClient.setQueriesData<{
        pages: ResponseLpListDto[];
      }>({ queryKey: [QUERY_KEY.lps] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              data: page.data.data.map((lp: Lp) => {
                if (lp.id === lpId) {
                  return {
                    ...lp,
                    likes: lp.likes.filter((like) => like.userId !== userId),
                  };
                }
                return lp;
              }),
            },
          })),
        };
      });

      return { previousLpDetail };
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 롤백
      if (context?.previousLpDetail) {
        queryClient.setQueryData(
          [QUERY_KEY.lpDetail, variables.lpId],
          context.previousLpDetail
        );
      }
    },
    onSettled: (data, error, variables) => {
      // 성공/실패 관계없이 쿼리 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpDetail, variables.lpId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
  });
}

