import axios, { AxiosResponse } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry: boolean; // 요청 재시도 여부를 나타내는 플래그
}

// 리프레시 요청에 프로미스 저장해서 중복 요청 방지
let refreshPromise: Promise<string> | null = null;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 전에 accessToken을 Authorization 헤더에 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken); // 로컬 스토리지에서 accessToken 가져오기
    // accessToken이 있으면 Authorization 헤더에 추가
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${JSON.parse(accessToken)}`;
    }
    return config;
  },
  (error) => {
    //요청 인터셉터 오류 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 발생 -> refresh 토큰을 통한 토큰 갱신을 처리합니다.
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<any, any>) => response, // 정상 응답 그대로 반환
  async (error) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    // 401 에러면서, 아직 재시도 하지 않은 요청 경우 처리
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // refresh 엔드 포인트 401 에러가 발생한 경우(Unauthorized), 중복 재시도 방지를 위해 로그아웃 시도
      if (originalRequest.url === "/v1/auth/refresh") {
        const { removeItem: removeAccessToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.accessToken
        );
        const { removeItem: removeRefreshToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.refreshToken
        );
        removeAccessToken();
        removeRefreshToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }
      // 재시도 플래그 설정
      originalRequest._retry = true;

      //이미 리프레시 요청이 진행중이면 해당 프로미스 반환
      if (!refreshPromise) {
        // 리프레시 요청 실행 후, 프로미스를 변수에 할당
        refreshPromise = (async () => {
          const { getItem: getRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken
          );
          const refreshToken = getRefreshToken();

          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });
          //새 토큰이 반환
          const { setItem: setAccessToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.accessToken
          );
          const { setItem: setRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken
          );
          setAccessToken(data.data.accessToken);
          setRefreshToken(data.data.refreshToken);
          //새 accessToken 반환하여 다른 요청들이 이것을 사용할 수 있도록 만든다.
          return data.data.accessToken;
        })()
          .catch((error) => {
            const { removeItem: removeAccessToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.accessToken
            );
            const { removeItem: removeRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.refreshToken
            );
            removeAccessToken();
            removeRefreshToken();
          })
          .finally(() => {
            refreshPromise = null;
          });
      }
      //진행중인 refresh Promise가 해결될 때까지 기다린다.
      return refreshPromise.then((newAccessToken: string) => {
        // 원본 요청의 Authorization 헤더를 새 accessToken으로 업데이트
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        //업데이트된 원본요청을 다시 보낸다.
        return axiosInstance.request(originalRequest);
      });
    }
    //401 에러가 아니라면 오류
    return Promise.reject(error);
  }
);

export default axiosInstance;
