import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { axiosClient } from "../apis/axiosClient";

const useFetch = <T>(url: string, options: AxiosRequestConfig) => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isloading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { data } = await axiosClient.get(url, {
                    ...options,
                });

                setData(data);
            } catch {
                setError("데이터를 가져오는데 에러가 발생했습니다다");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);


    return { data, error, isloading };

};

export default useFetch;