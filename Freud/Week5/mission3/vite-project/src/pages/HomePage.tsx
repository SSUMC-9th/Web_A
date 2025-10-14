import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyInfo } from '../apis/auth';
import type { UserInfo } from '../types/auth';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isCancelled = false;

        const fetchUserInfo = async () => {
            if (isAuthenticated) {
                setLoading(true);
                try {
                    const response = await getMyInfo();
                    if (!isCancelled) {
                        setUserInfo(response.data);
                    }
                } catch (error) {
                    console.error('사용자 정보 가져오기 실패:', error);
                    if (!isCancelled) {
                        logout();
                    }
                } finally {
                    if (!isCancelled) {
                        setLoading(false);
                    }
                }
            } else {
                // 인증되지 않은 경우 userInfo 초기화
                setUserInfo(null);
                setLoading(false);
            }
        };

        fetchUserInfo();

        return () => {
            isCancelled = true;
        };
    }, [isAuthenticated, logout]);

    const handleLogout = () => {
        logout();
        setUserInfo(null);
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
                {isAuthenticated && userInfo ? (
                    <>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {userInfo.name}님, 환영합니다!
                        </h1>
                        <div className="text-gray-600">
                            <p>이메일: {userInfo.email}</p>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/my')}
                                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                마이페이지 (Protected Route)
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                로그아웃
                            </button>
                        </div>
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

                        <div>
                            <p>
                                Protected Route 테스트 방법
                            </p>

                            <p>
                                주소창에 "/my" 를 입력해보세요!
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HomePage;