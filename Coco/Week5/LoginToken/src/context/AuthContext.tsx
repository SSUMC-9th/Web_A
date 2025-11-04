import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '../utils/axiosInstance';

interface AuthContextType {
  isAuthenticated: boolean;
  isPremium: boolean;
  user: { email: string; nickname: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  upgradeToPremium: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [user, setUser] = useState<{ email: string; nickname: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // 초기 로딩 시 토큰 확인
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        try {
          // 사용자 정보 가져오기 (서버 API 호출)
          const response = await axiosInstance.get('/user/me');
          setUser(response.data);
          setIsAuthenticated(true);
          // 프리미엄 여부는 서버 응답에서 확인
          setIsPremium(response.data.isPremium || false);
        } catch (error) {
          console.error('토큰 검증 실패:', error);
          // 토큰이 유효하지 않으면 제거
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // 실제 로그인 API 호출
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      const { accessToken, refreshToken, user: userData } = response.data;

      // 토큰 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // 사용자 정보 저장
      setIsAuthenticated(true);
      setUser(userData);
      setIsPremium(userData.isPremium || false);
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  };

  const logout = () => {
    // 토큰 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // 상태 초기화
    setIsAuthenticated(false);
    setIsPremium(false);
    setUser(null);
  };

  const signup = async (email: string, password: string, nickname: string) => {
    try {
      // 회원가입 API 호출
      const response = await axiosInstance.post('/auth/register', {
        email,
        password,
        nickname,
      });

      const { accessToken, refreshToken, user: userData } = response.data;

      // 토큰 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // 사용자 정보 저장
      setIsAuthenticated(true);
      setUser(userData);
      setIsPremium(false);
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  };

  const upgradeToPremium = () => {
    setIsPremium(true);
    // 실제로는 서버에 프리미엄 업그레이드 요청을 보내야 함
    // axiosInstance.post('/user/upgrade-premium');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isPremium,
        user,
        login,
        logout,
        signup,
        upgradeToPremium,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}