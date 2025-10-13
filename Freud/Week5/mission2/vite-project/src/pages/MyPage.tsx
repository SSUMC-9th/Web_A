import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyInfo } from '../apis/auth';
import type { UserInfo } from '../types/auth';

const MyPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await getMyInfo();
                setUserInfo(response.data);
            } catch (error) {
                console.error('사용자 정보 가져오기 실패:', error);
                alert('사용자 정보를 불러올 수 없습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = () => {
        logout();
        // 로그아웃 후 즉시 홈으로 이동
        setTimeout(() => {
            navigate('/');
        }, 100);
    };

    const handleGoHome = () => {
        navigate('/');
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
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    마이페이지
                </h1>

                {userInfo && (
                    <div className="space-y-4 mb-6">
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-700">
                                {userInfo.name}님
                            </p>
                            <p className="text-gray-600 text-sm">
                                {userInfo.email}
                            </p>
                        </div>

                        {userInfo.bio && (
                            <div className="border-t pt-4">
                                <p className="text-gray-600 text-sm text-center">
                                    {userInfo.bio}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={handleGoHome}
                        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        홈으로 가기
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        로그아웃
                    </button>
                </div>

                <div className="text-center">
                    <p >
                        이 페이지는 Protected Route로 보호됩니다!

                    </p>
                    <p>
                        로그인한 사용자만 접근할 수 있습니다.

                    </p>
                </div>

            </div>
        </div>
    );
};

export default MyPage;
