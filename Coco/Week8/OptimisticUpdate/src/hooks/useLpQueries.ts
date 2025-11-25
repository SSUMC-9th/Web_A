// hooks/useLpQueries.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { lpApi } from '../api/lpApi';
import type { SortOrder } from '../types/lp.types';

export const useLpList = (sort: SortOrder) => {
  return useInfiniteQuery({
    queryKey: ['lps', sort],
    queryFn: ({ pageParam = 1 }) => lpApi.getLps(pageParam as number, sort),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
  });
};

export const useLpDetail = (lpId: string) => {
  return useQuery({
    queryKey: ['lp', lpId],
    queryFn: () => lpApi.getLpById(lpId),
    enabled: !!lpId,
  });
};

// ✅ useLpComments 추가
export const useLpComments = (lpId: string, order: SortOrder) => {
  return useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    queryFn: ({ pageParam = 1 }) => lpApi.getComments(lpId, pageParam as number, order),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    enabled: !!lpId,
  });
};