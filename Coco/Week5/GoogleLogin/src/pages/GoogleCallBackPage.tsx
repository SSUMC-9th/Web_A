import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';

const GoogleCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // URL에서 authorization code 추출
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Google 인증 실패: ${error}`);
        }

        if (!code) {
          throw new Error('Authorization code를 받지 못했습니다.');
        }

        // 서버에 code 전송하여 사용자 정보 및 토큰 받기
        const response = await axiosInstance.post('/auth/google/callback', {
          code,
          redirectUri: `${window.location.origin}/auth/google/callback`,
        });

        const { accessToken, refreshToken, user } = response.data;

        // AuthContext의 googleLogin 함수를 사용하여 상태 업데이트
        // 이렇게 하면 컴포넌트 전체에서 인증 상태가 동기화됩니다
        
        // 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // 성공 메시지
        alert(`환영합니다, ${user.nickname}님!`);
        
        // 홈으로 리다이렉트 (페이지 새로고침으로 AuthContext가 초기화됨)
        window.location.href = '/';
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
        console.error('Google 로그인 처리 오류:', errorMessage);
        setError(errorMessage);
        setIsProcessing(false);
        
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인 실패</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">잠시 후 로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Google 로그인 처리 중</h2>
        <p className="text-gray-600">잠시만 기다려주세요...</p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;