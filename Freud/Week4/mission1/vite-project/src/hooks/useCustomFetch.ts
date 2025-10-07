import { useState, useEffect } from 'react';
import axios from 'axios';

interface UseCustomFetchResult<T> {
    data: T | null;
    isLoading: boolean;
    isError: boolean;
    error: string | null;
}

const useCustomFetch = <T>(url: string, dependencies: any[] = []): UseCustomFetchResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // URL이 없으면 요청하지 않음
        if (!url) return;

        const fetchData = async () => {
            setIsLoading(true);
            setIsError(false);
            setError(null);

            try {
                const response = await axios.get<T>(url, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                });
                setData(response.data);
            } catch (err) {
                console.error('데이터를 불러오는 데 실패했습니다:', err);
                setIsError(true);
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.status_message || '데이터를 불러오는 데 실패했습니다.');
                } else {
                    setError('알 수 없는 오류가 발생했습니다.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url, ...dependencies]);

    return { data, isLoading, isError, error };
};

export default useCustomFetch;