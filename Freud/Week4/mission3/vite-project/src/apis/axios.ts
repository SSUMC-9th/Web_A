import axios, { type AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터 - Authorization 헤더 자동 추가
axiosInstance.interceptors.request.use(
    (config) => {
        const authTokens = localStorage.getItem('authTokens');
        if (authTokens) {
            try {
                const tokens = JSON.parse(authTokens);
                if (tokens.accessToken) {
                    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
                }
            } catch (error) {
                console.error('토큰 파싱 오류:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 401 오류 처리
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 토큰이 만료되었거나 유효하지 않은 경우
            localStorage.removeItem('authTokens');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;