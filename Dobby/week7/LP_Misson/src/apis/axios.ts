import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; //요청 재시도 여부를 나타내는 플래그
}

//전역 변수로 refresh 요청의 Promise를 저장해서 중복 요청을 방지한다
let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  /* headers: {
        Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)}`,
    }, */
});

// 리프레시 전용 인스턴스(요청/응답 인터셉터 비적용, Authorization 헤더 없음)
const refreshAxios = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

//요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 추가한다
axiosInstance.interceptors.request.use(
  (config) => {
    const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    const accessToken = getItem(); //로컬 스토리지에서 accessToken을 가져온다

    //accessToken이 있으면 Authorization 헤더에 Bearer 토큰 형식으로 추가한다
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    //수정된 요청 설정을 반환한다
    return config;
  },
  //요청 인터셉터가 실패하면, 에러를 반환한다
  (error) => {
    return Promise.reject(error);
  }
);

//응답 인터셉터: 401에러 발생 -> refreshToken으로 새로운 토큰 갱신을 처리
axiosInstance.interceptors.response.use(
  (response) => response, //정상 응답 그대로 반환
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    //401에러이고, 이미 재시도 중이 아니라면
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // refresh 엔드포인트 401 → 토큰 제거 후 로그인으로 이동
      if (originalRequest.url === "/v1/auth/refresh") {
        const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
        const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN);

        removeAccessToken();
        removeRefreshToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      //재시도 플래그 설정
      originalRequest._retry = true;

      //이미 리프레시 요청이 진행중이면 , 그 Promise를 재사용한다.
      if (!refreshPromise) {
        // refresh 요청 실행 후, Promise를 전역 변수에 할당
        refreshPromise = (async () => {
          const { getItem: getRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
          const refreshToken = getRefreshToken();
          const { data } = await refreshAxios.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });
          // 백엔드 공통 응답 스키마: { data: { accessToken, refreshToken } }
          const newAccessToken = data?.data?.accessToken;
          const newRefreshToken = data?.data?.refreshToken;

          const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
          const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
          if (newAccessToken) setAccessToken(newAccessToken);
          if (newRefreshToken) setRefreshToken(newRefreshToken);

          // 새 accessToken 반환
          return newAccessToken;
        })()
          .catch((e) => {
            const { removeItem: removeAccessToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.ACCESS_TOKEN
            );
            const { removeItem: removeRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.REFRESH_TOKEN
            );
            removeAccessToken();
            removeRefreshToken();
            window.location.href = "/login";
            // 거부하여 상위 체인이 재시도를 중단하게 함
            throw e;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      return refreshPromise.then((newAccessToken) => {
        if (!newAccessToken) {
          return Promise.reject(error);
        }
        // 원본 요청의 Authorization 헤더를 새 accessToken으로 업데이트
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        // 업데이트된 요청을 다시 실행
        return axiosInstance.request(originalRequest);
      });
    }
    //401에러가 아닌경우에 그대로 오류를 반환
    return Promise.reject(error);
  }
);
