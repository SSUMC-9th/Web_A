import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

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
                    const tokenPreview = tokens.accessToken.substring(0, 20) + '...';
                    console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`);
                    console.log(`사용 중인 토큰: ${tokenPreview}`);
                }
            } catch (error) {
                console.error('토큰 파싱 오류:', error);
            }
        } else {
            console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url} (토큰 없음)`);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// refresh 엔드포인트인지 401 에러 발생 -> refresh 토큰을 활용해 갱신을 시도합니다.
axiosInstance.interceptors.response.use(
    (response) => response, // 성공 응답은 그대로 반환
    async (error) => {
        const originalRequest: InternalAxiosRequestConfig & { _retry?: boolean } = error.config;

        // 401 에러이고, 아직 재시도하지 않았으며, refresh 엔드포인트가 아닌 경우
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== '/v1/auth/refresh'
        ) {
            console.log('Access Token 만료 감지! 토큰 갱신을 시작합니다... @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
            originalRequest._retry = true;

            try {
                const authTokens = localStorage.getItem('authTokens');
                if (!authTokens) {
                    throw new Error('토큰이 없습니다.');
                }

                const tokens = JSON.parse(authTokens);
                if (!tokens.refreshToken) {
                    throw new Error('리프레시 토큰이 없습니다.');
                }

                console.log('Refresh Token으로 새로운 Access Token 요청 중...');

                // Refresh 토큰으로 새로운 Access Token 발급
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/refresh`,
                    { refresh: tokens.refreshToken }
                );

                if (refreshResponse.data) {
                    const newAccessToken = refreshResponse.data.data.accessToken;
                    const newRefreshToken = refreshResponse.data.data.refreshToken;

                    console.log('토큰 갱신 성공! ★★★★★★★★★★★★★★★★★★★★★★★★');
                    console.log('새로운 Access Token:', newAccessToken.substring(0, 20) + '...');

                    // 새로운 토큰들을 localStorage에 저장
                    localStorage.setItem('authTokens', JSON.stringify({
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                    }));

                    // 원래 요청의 Authorization 헤더 업데이트
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    console.log('원래 요청을 새로운 토큰으로 재시도 중...');

                    // 원래 요청 재시도
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error('토큰 갱신 실패:', refreshError);

                // 리프레시 실패 시 로그아웃 처리
                localStorage.removeItem('authTokens');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;