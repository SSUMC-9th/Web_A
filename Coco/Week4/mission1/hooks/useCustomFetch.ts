import { useEffect, useState } from 'react';
import axios from 'axios';

interface UseCustomFetchOptions {
  url: string;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  enabled?: boolean;
}

interface UseCustomFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCustomFetch<T = any>({
  url,
  params = {},
  headers = {},
  enabled = true,
}: UseCustomFetchOptions): UseCustomFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!enabled || !url) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<T>(url, {
          params,
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            ...headers,
          },
        });
        setData(response.data);
      } catch (err: any) {
        let errorMessage = '데이터를 불러오는데 실패했습니다.';
        
        if (err.response) {
          errorMessage = err.response.data?.status_message || err.message || errorMessage;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, JSON.stringify(params), JSON.stringify(headers), enabled, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return { data, loading, error, refetch };
}