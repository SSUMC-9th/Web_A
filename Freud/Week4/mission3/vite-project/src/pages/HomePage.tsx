import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getMyInfo } from '../apis/auth';
import type { TokenData, UserInfo } from '../types/auth';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [authTokens, setAuthTokens] = useLocalStorage<TokenData | null>('authTokens', null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (authTokens?.accessToken) {
                setLoading(true);
                try {
                    const response = await getMyInfo();
                    setUserInfo(response.data);
                } catch (error) {
                    console.error('사용자 정보 가져오기 실패:', error);
                    // 토큰이 유효하지 않으면 제거
                    setAuthTokens(null);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserInfo();
    }, [authTokens, setAuthTokens]);

    const handleLogout = () => {
        setAuthTokens(null);
        setUserInfo(null);
        alert('로그아웃되었습니다.');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md text-center">
                    <div className="text-gray-600">로딩 중...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md text-center">
                {userInfo ? (
                    <>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            {userInfo.name}님, 환영합니다!
                        </h1>
                        <div className="text-gray-600 mb-6">
                            <p>이메일: {userInfo.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            로그아웃
                        </button>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-gray-800 mb-8">환영합니다!</h1>
                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                로그인
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                회원가입
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HomePage;