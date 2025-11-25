// hooks/useLpQueries.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { lpApi } from '../api/lpApi';
import type { SortOrder } from '../types/lp.types';

export const useLpList = (sort: SortOrder) => {
  return useInfiniteQuery({
    queryKey: ['lps', sort],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => lpApi.getLps(pageParam, sort),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useLpDetail = (lpId: string) => {
  return useQuery({
    queryKey: ['lp', lpId],
    queryFn: () => lpApi.getLpById(lpId),
    staleTime: 1000 * 60 * 5,
  });
};
export const useLpComments = (lpId: string, order: SortOrder) => {
  return useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => lpApi.getComments(lpId, pageParam, order),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });
};