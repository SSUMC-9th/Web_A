import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

declare module "axios" {
    export interface AxiosRequestConfig {
        withAuth?: boolean;
    }
}
// 일반 API 인스턴스
export const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
    headers: {"Content-Type": "application/json"},
    withCredentials: true,
});

// 리프레시 전용 인스턴스
const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
    headers: {"Content-Type": "application/json"},
    withCredentials: true,
});

// 토큰 갱신 중인지 상태 관리
let isRefreshing = false;
let failedQueue: {
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}[] = [];

// 실패한 요청 큐 처리 함수
const processQueue = (error:unknown, token: string | null = null) => {
    failedQueue.forEach(({resolve, reject} ) => {
        if (error) reject(error);
        else resolve(token as string);
    });
    failedQueue = [];
}

// 요청 인터셉터
api.interceptors.request.use((config) => {
    const needAuth = config.withAuth === true;
    if (needAuth) {
        const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
        if (token && token !== "undefined" && token !== "null") {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    
    return config;
});

// 응답 인터셉터 (401 감지 -> 토큰 재발급 시도)
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest=  error.config as AxiosRequestConfig & { _retry?:boolean};

        const status = error.response?.status;
        const url = originalRequest?.url ?? "";

        if (url.includes("/v1/auth/refresh")) {
            return Promise.reject(error);   // refresh 자체 401이면 바로 실패 처리
        }

        if (!originalRequest.withAuth) {
            return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN);

        // 401이고, 이미 재시도한 요청이 아니면
        if (status === 401 && !originalRequest._retry) {
            // refreshToken 없으면 재발급 시도 안 함
            if (!refreshToken || refreshToken === "undefined" || refreshToken === "null") {
                return Promise.reject(error);
            }

            // 이미 다른 요청이 refresh 중이면 대기
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers = originalRequest.headers ?? {};
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // 리프레시 전용 인스턴스로 토큰 재발급 요청
                const refreshResponse = await refreshApi.post(
                    "/v1/auth/refresh",
                    {refresh: refreshToken},
                    {headers: { 
                        Authorization: `Bearer ${refreshToken}`,
                        "Content-Type": "application/json",
                    } }
                );

                const newAccessToken = refreshResponse.data?.data?.accessToken;
                const newRefreshToken = refreshResponse.data?.data?.refreshToken;

                if (!newAccessToken) throw new Error("반환된 Access Token이 없습니다.");

                // 토큰 저장
                localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, newAccessToken);
                if (newRefreshToken)
                    localStorage.setItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN, newRefreshToken);

                // 실패 큐 처리 (대기중인 요청 재시도)
                processQueue(null, newAccessToken);

                // 원래 요청에 새 토큰 부착 후 재시도
                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                
                return api(originalRequest);
            }
            catch (err) {
                // refresh에 실패하면 로그아웃
                processQueue(err, null);
                console.warn("토큰 재발급 실패. 로그아웃합니다.")
                localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
                localStorage.removeItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
                
                return Promise.reject(err);
            }
            finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export type ApiError = AxiosError<{
    status?: boolean;
    statusCode?: number;
    message?: string;
}>;