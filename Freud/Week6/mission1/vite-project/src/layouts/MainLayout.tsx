import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '../apis/user';

const MainLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const { data: userData } = useQuery({
        queryKey: ['user', 'me'],
        queryFn: getUserInfo,
        enabled: isAuthenticated,
    });

    const user = userData?.data;

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="px-4 py-4 mx-auto max-w-7xl">
                    <div className="flex items-center justify-between">
                        {/* Logo & Burger Menu */}
                        <div className="flex items-center gap-4">
                            {/* 모바일 버거 메뉴 */}
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="메뉴 열기"
                            >
                                <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32" />
                                </svg>
                            </button>

                            <Link to="/" className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-blue-600">돌려돌려LP판</span>
                            </Link>
                        </div>

                        {/* Auth Section */}
                        <div className="flex items-center gap-3">
                            {isAuthenticated ? (
                                <>
                                    {/* function */}
                                    {/* 로그인 상태에서 (닉네임)님 반갑습니다. 문구가 실제 상태 값으로 보이도록 구현하셨나요? 상태값을 연동하고, 
                                    필요한 경우 환영 문구 영역을 조건부 렌더링으로 라우팅 */}
                                    {user?.name && (
                                        <span className="hidden sm:inline text-sm text-gray-700">
                                            {user.name}님 반갑습니다.
                                        </span>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        로그아웃
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        로그인
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                    >
                                        회원가입
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar & Main Content */}
            <div className="flex pt-16">
                {/* Sidebar Overlay (모바일) */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                        onClick={toggleSidebar}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`
            fixed top-16 left-0 bottom-0 z-40 w-64 bg-white border-r border-gray-200 overflow-y-auto
            transition-transform duration-300 ease-in-out
            lg:translate-x-0 lg:static
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
                >
                    <nav className="p-4 space-y-2">
                        <Link
                            to="/"
                            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span className="font-medium">홈</span>
                            </div>
                        </Link>

                        {isAuthenticated && (
                            <>
                                <Link
                                    to="/my"
                                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="font-medium">마이 페이지</span>
                                    </div>
                                </Link>

                                <Link
                                    to="/lp/create"
                                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="font-medium">LP 등록</span>
                                    </div>
                                </Link>
                            </>
                        )}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Floating Button */}
            {isAuthenticated && (
                <Link
                    to="/lp/create"
                    className="fixed bottom-8 right-8 z-30 flex items-center justify-center w-14 h-14 text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition-all hover:scale-110"
                    aria-label="LP 등록"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </Link>
            )}
        </div>
    );
};

export default MainLayout;
