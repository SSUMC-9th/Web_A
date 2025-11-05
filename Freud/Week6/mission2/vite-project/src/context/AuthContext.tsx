import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { postSignin } from '../apis/auth';
import type { TokenData, RequestSigninDto } from '../types/auth';

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (signinData: RequestSigninDto) => Promise<void>;
    logout: () => void;
    refreshTokens: (newTokens: TokenData) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // 단일 상태로 통합 - localStorage에서 직접 읽기
    const [authState, setAuthState] = useState<TokenData | null>(() => {
        try {
            const stored = localStorage.getItem('authTokens');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    // localStorage와 상태 동기화
    const updateAuthState = (tokens: TokenData | null) => {
        setAuthState(tokens);
        if (tokens) {
            localStorage.setItem('authTokens', JSON.stringify(tokens));
        } else {
            localStorage.removeItem('authTokens');
        }
    };

    const login = async (signinData: RequestSigninDto) => {
        try {
            const response = await postSignin({ body: signinData });

            const tokens = {
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
            };

            updateAuthState(tokens);
            alert('로그인 성공!');
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('로그인에 실패했습니다.');
            throw error;
        }
    };

    const logout = () => {
        updateAuthState(null);
        alert('로그아웃되었습니다.');
    };

    // 토큰 갱신 함수 (Axios 인터셉터에서 호출용)
    const refreshTokens = (newTokens: TokenData) => {
        updateAuthState(newTokens);
    };

    // localStorage 변화 감지 (다른 탭에서 토큰이 갱신된 경우)
    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const stored = localStorage.getItem('authTokens');
                const newTokens = stored ? JSON.parse(stored) : null;

                // 현재 상태와 다르다면 업데이트
                if (JSON.stringify(authState) !== JSON.stringify(newTokens)) {
                    setAuthState(newTokens);
                }
            } catch (error) {
                console.error('localStorage 동기화 오류:', error);
            }
        };

        // storage 이벤트 리스너 등록 (다른 탭에서의 변경사항 감지)
        window.addEventListener('storage', handleStorageChange);

        // 주기적으로 localStorage 확인 (같은 탭 내에서의 변경사항 감지)
        const interval = setInterval(handleStorageChange, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [authState]);

    const value: AuthContextType = {
        accessToken: authState?.accessToken || null,
        refreshToken: authState?.refreshToken || null,
        login,
        logout,
        refreshTokens,
        isAuthenticated: !!authState?.accessToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('AuthContext를 찾을 수 없습니다.');
    }
    return context;
};