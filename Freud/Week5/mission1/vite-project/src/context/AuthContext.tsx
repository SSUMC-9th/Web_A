import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { postSignin } from '../apis/auth';
import type { TokenData, RequestSigninDto } from '../types/auth';

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (signinData: RequestSigninDto) => Promise<void>;
    logout: () => void;
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

    const value: AuthContextType = {
        accessToken: authState?.accessToken || null,
        refreshToken: authState?.refreshToken || null,
        login,
        logout,
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