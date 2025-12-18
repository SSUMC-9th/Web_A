import type { AxiosRequestConfig } from "axios";
import { useState, useEffect } from "react";
import axiosClient from "../apis/axiosClient";

const useFetch = <T>(url: string, options?: AxiosRequestConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setIsLoading] = useState<boolean>(false);

  useEffect(
    () => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const { data } = await axiosClient.get(url, {
            ...options,
          });
          setData(data);
        } catch {
          setError("Error defining the data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } /*[url, options]*/, // <- 최적화 핵심 options는 객체이다. 그런데 리렌더링마다 options가 동일한 참조값이라 생각하지 않아서 무한 렌더링 발생
    [url, options]
  );

  return { data, error, loading };
};

export default useFetch;

//새로운 객체 생성: Homepage 컴포넌트가 리렌더링될 때마다,
//  useFetch를 호출하는 시점에서 두 번째 인수인 options 객체가 새롭게 생성
//내용물(filters)이 같더라도, 메모리 주소가 다르므로 useEffect는 options가 변경되었다고 판단.
// -> 무한 리렌더링 발생  .
