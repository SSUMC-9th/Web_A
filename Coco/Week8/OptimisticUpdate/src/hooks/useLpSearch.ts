// hooks/useLpSearch.ts
import { useQuery } from '@tanstack/react-query';
import { lpApi } from '../api/lpApi';
import { useMemo } from 'react';

export const useLpSearch = (query: string) => {
  // 전체 LP 목록 가져오기
  const { data: allLps, isLoading, isError } = useQuery({
    queryKey: ['allLps'],
    queryFn: async () => {
      let page = 1;
      let allItems: any[] = [];
      let hasMore = true;

      while (hasMore && page < 10) { // 최대 10페이지
        const result = await lpApi.getLps(page, 'latest');
        allItems = [...allItems, ...result.items];
        hasMore = result.hasMore;
        page++;
      }

      return allItems;
    },
    staleTime: 1000 * 60 * 5,
    enabled: query.trim().length > 0,
  });

  // 검색어로 필터링
  const filteredLps = useMemo(() => {
    if (!allLps || !query.trim()) return [];

    return allLps.filter(lp =>
      lp.title.toLowerCase().includes(query.toLowerCase()) ||
      lp.content.toLowerCase().includes(query.toLowerCase())
    );
  }, [allLps, query]);

  return {
    data: filteredLps,
    isLoading,
    isError,
  };
};