import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";

function useCustomFetch<T = unknown>(url:string, options?: AxiosRequestConfig) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=> {
        if (!url) return;
        
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get<T>(url, options);
                setData(response.data);
            }
            catch (err) {
                console.error(err);
                setError("데이터를 불러오는 중 오류 발생");
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url, JSON.stringify(options)]); // URL이나 옵션이 바뀌면 재호출
    
    return { data, isLoading, error};
}

export default useCustomFetch;