import type { InfiniteData, QueryKey } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { postLp } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { CreateLpBody, ResponseLpDetailDto } from "../../types/lp";

// 실제 화면(HomePage 등)에서 사용하는 리스트 아이템은 "평평한(Flat)" 구조이므로
// 캐시 조작 시에도 Flat 구조로 다룬다.
type FlatLpItem = ResponseLpDetailDto["data"];
type FlatListDto = {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: FlatLpItem[];
    nextCursor: number;
    hasNext: boolean;
  };
};

export default function useCreateLp() {
  return useMutation<
    ResponseLpDetailDto,
    unknown,
    CreateLpBody,
    { previousQueries: Array<{ queryKey: QueryKey; previousData: unknown }>; tempId: number }
  >({
    mutationFn: (body: CreateLpBody) => postLp(body),
    // 낙관적 업데이트: 추가 버튼 클릭 시 목록 최상단에 임시 아이템을 삽입
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lps] });

      const tempId = -Date.now();
      const now = new Date() as unknown as Date;
      const optimisticItem: FlatLpItem = {
        id: tempId,
        title: body.title,
        content: body.content ?? "",
        thumbnail: body.thumbnail,
        published: body.published ?? true,
        authorId: 0,
        createdAt: now,
        updatedAt: now,
        tags: (body.tags ?? []).map((name, idx) => ({ id: tempId - (idx + 1), name })),
        likes: [],
      };

      // [QUERY_KEY.lps] 로 시작하는 모든 쿼리(일반/무한 스크롤)를 찾아 스냅샷 저장 후 캐시 업데이트
      const touchedQueries = queryClient.getQueriesData({ queryKey: [QUERY_KEY.lps] });
      const previousQueries = touchedQueries.map(([qk, prev]) => {
        // 일반 쿼리 (ResponseLpListDto)
        if (prev && typeof prev === "object" && "data" in (prev as Record<string, unknown>)) {
          const prevTyped = prev as FlatListDto;
          if (Array.isArray(prevTyped.data?.data)) {
            const nextList: FlatLpItem[] = [optimisticItem, ...prevTyped.data.data];
            const next: FlatListDto = {
              ...prevTyped,
              data: {
                ...prevTyped.data,
                data: nextList,
              },
            };
            queryClient.setQueryData(qk as QueryKey, next);
            return { queryKey: qk as QueryKey, previousData: prev };
          }
        }

        // 무한 쿼리 (pages 배열)
        if (prev && typeof prev === "object" && "pages" in (prev as Record<string, unknown>)) {
          const prevInf = prev as InfiniteData<FlatListDto>;
          const pages = prevInf.pages;
          if (pages.length > 0 && Array.isArray(pages[0]?.data?.data)) {
            const first = pages[0];
            const nextFirst: FlatListDto = {
              ...first,
              data: {
                ...first.data,
                data: [optimisticItem, ...first.data.data],
              },
            };
            const next: InfiniteData<FlatListDto> = {
              ...prevInf,
              pages: [nextFirst, ...pages.slice(1)],
            };
            queryClient.setQueryData(qk as QueryKey, next);
            return { queryKey: qk as QueryKey, previousData: prev };
          }
        }

        return { queryKey: qk as QueryKey, previousData: prev };
      });

      return { previousQueries, tempId };
    },
    // 에러 시 롤백
    onError: (_err, _variables, context) => {
      if (!context) return;
      context.previousQueries?.forEach(({ queryKey, previousData }) => {
        queryClient.setQueryData(queryKey, previousData);
      });
    },
    // 성공 시 임시 아이템을 실제 생성된 아이템으로 교체
    onSuccess: async (result, _variables, context) => {
      const created: FlatLpItem | undefined = result?.data as FlatLpItem | undefined;
      if (context?.tempId && created) {
        const affected = queryClient.getQueriesData({ queryKey: [QUERY_KEY.lps] });
        affected.forEach(([qk, prev]) => {
          // 일반 쿼리
          if (prev && typeof prev === "object" && "data" in (prev as Record<string, unknown>)) {
            const prevTyped = prev as FlatListDto;
            if (Array.isArray(prevTyped.data?.data)) {
              const replaced: FlatLpItem[] = prevTyped.data.data.map((item) =>
                item.id === context.tempId ? created : item
              );
              const next: FlatListDto = {
                ...prevTyped,
                data: {
                  ...prevTyped.data,
                  data: replaced,
                },
              };
              queryClient.setQueryData(qk as QueryKey, next);
              return;
            }
          }

          // 무한 쿼리
          if (prev && typeof prev === "object" && "pages" in (prev as Record<string, unknown>)) {
            const prevInf = prev as InfiniteData<FlatListDto>;
            const nextPages = prevInf.pages.map((page) => {
              if (Array.isArray(page?.data?.data)) {
                const replaced: FlatLpItem[] = page.data.data.map((item) =>
                  item.id === context.tempId ? created : item
                );
                return {
                  ...page,
                  data: { ...page.data, data: replaced },
                };
              }
              return page;
            });
            const next: InfiniteData<FlatListDto> = { ...prevInf, pages: nextPages };
            queryClient.setQueryData(qk as QueryKey, next);
          }
        });
      }

      // 서버 상태 동기화를 위해 마지막에 최신화
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
}
