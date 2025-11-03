// import { useEffect, useMemo, useRef, useState } from "react";

// const STALE_TIME = 5 * 60 * 1000; // 5 minutes

// const MAX_RETRIES = 3;

// const INITIAL_RETRY_DELAY = 1_000;

// //로컬스토리지에 저장할 데이터 구조조
// interface CacheEntry<T> {
//   data: T;
//   lastFetched: number; // 마지막으로 데이터를 가져온 시점 타임 스탬프프
// }

// export const useCustomFetch = <T>(
//   url: string
// ): { data: T | null; isPending: boolean; isError: boolean } => {
//   const [data, setData] = useState<T | null>(null);
//   const [isPending, setIsPending] = useState<boolean>(false);
//   const [isError, setIsError] = useState<boolean>(false);

//   const storageKey = useMemo((): string => url, [url]);

//   const abortControllerRef = useRef<AbortController | null>(null);

//   const retryTimeoutRef = useRef<number | null>(null);

//   useEffect(() => {
//     abortControllerRef.current = new AbortController();
//     setIsError(false);
//     const fetchData = async (currentRetry = 0): Promise<void> => {
//       const currentTime = new Date().getTime();
//       const cachedItem = localStorage.getItem(storageKey);

//       //캐시 데이터 확인, 신선도 검증증
//       if (cachedItem) {
//         try {
//           const cachedData: CacheEntry<T> = JSON.parse(cachedItem);
//           //캐시가 신선한 경우 (STALE_TIME 이내)
//           if (currentTime - cachedData.lastFetched < STALE_TIME) {
//             setData(cachedData.data);
//             setIsPending(false);
//             console.log("캐시 데이터 사용", url);
//             return;
//           }

//           //캐시가 만료된 경우 (STALE_TIME 초과)
//           setData(cachedData.data);
//           console.log("캐시 데이터 만료된 것 사용용", url);
//           localStorage.removeItem(storageKey);
//         } catch {
//           localStorage.removeItem(storageKey);
//           console.error("캐시 에러 : 캐시 삭제함", url);
//         }
//       }
//       setIsPending(true);

//       try {
//         const response = await fetch(url, {
//           signal: abortControllerRef.current?.signal,
//         });

//         if (!response.ok) {
//           throw new Error("Fail to fetch data");
//         }

//         const newdata = (await response.json()) as T;
//         setData(newdata);

//         const newCacheEntry: CacheEntry<T> = {
//           data: newdata,
//           lastFetched: new Date().getTime(), //현재 시간을 타임 스탬프로 저장
//         };
//         localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
//       } catch (error) {
//         if (error instanceof Error && error.name === "AbortError") {
//           console.log("요청 취소됨", url);
//           return;
//         }

//         if (currentRetry < MAX_RETRIES) {
//           const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);
//           console.log(
//             `재시도, ${currentRetry + 1}/${MAX_RETRIES} Retrying ${retryDelay}ms later...`
//           );

//           retryTimeoutRef.current = setTimeout((): void => {
//             fetchData(currentRetry + 1);
//           }, retryDelay);
//         } else {
//           setIsError(true);
//           setIsPending(false);
//           console.log("최대 재시도 횟수 초과", url);
//           return;
//         }
//         setIsError(true);
//         console.error(error);
//       } finally {
//         setIsPending(false);
//       }
//     };
//     fetchData();

//     return (): void => {
//       abortControllerRef.current?.abort();

//       if (retryTimeoutRef.current !== null) {
//         clearTimeout(retryTimeoutRef.current);
//         retryTimeoutRef.current = null;
//       }
//     };
//   }, [url, storageKey]);

//   return { data, isPending, isError };
// };
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export const useCustomFetch = <T>(url: string): UseQueryResult<T, Error> => {
    return useQuery({
        queryKey: [url],

        queryFn: async ({signal}) => {
            const response = await fetch(url, {signal});

            if (!response.ok) {
                throw new Error('Fail to fetch data');
            }

            return response.json() as Promise<T>;
        },

        retry: 10,

        retryDelay: (attemptIndex): number => {
            return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
        },

        staleTime: 5 * 60 * 1000, // 5 minutes

        gcTime: 10 * 60 * 1000, // 10 minutes


    });
};