import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { refreshTokens } = useAuth();
    const [isProcessed, setIsProcessed] = useState(false);

    useEffect(() => {
        // 이미 처리되었다면 다시 실행하지 않음
        if (isProcessed) return;

        const processGoogleCallback = () => {
            // URL에서 파라미터 추출
            const userId = searchParams.get('userId');
            const name = searchParams.get('name');
            const accessToken = searchParams.get('accessToken');
            const refreshToken = searchParams.get('refreshToken');

            console.log('Google OAuth 콜백 처리:', { userId, name, accessToken: !!accessToken, refreshToken: !!refreshToken });

            if (userId && name && accessToken && refreshToken) {
                // 처리 완료 표시
                setIsProcessed(true);

                // AuthContext 상태 업데이트 (토큰 정보만)
                refreshTokens({
                    accessToken,
                    refreshToken,
                });

                // 성공 메시지 표시
                alert('Google 로그인 성공!');

                // 홈페이지로 리다이렉트
                navigate('/', { replace: true });
            } else {
                // 파라미터가 부족한 경우 에러 처리
                console.error('Google OAuth 콜백에서 필요한 파라미터가 누락되었습니다.');
                alert('Google 로그인 중 오류가 발생했습니다.');
                navigate('/login', { replace: true });
            }
        };

        processGoogleCallback();
    }, [searchParams, navigate, refreshTokens, isProcessed]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Google 로그인 처리 중...</p>
            </div>
        </div>
    );
};

export default GoogleCallbackPage;