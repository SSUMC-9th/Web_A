import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import hamburgerIcon from "../assets/icons/hamburger-button.svg";

export default function HomeLayout () {
    const [open, setOpen] = useState(false);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const { isLoggedIn, logout} = useAuth();
    const navigate = useNavigate();

    // 외부 클릭 시 사이드바 닫기
    useEffect(() => {
        function onClick(e:MouseEvent) {
            if (!open) return;
            const target = e.target as HTMLElement;
            if (overlayRef.current && target === overlayRef.current) setOpen(false);
        }
        window.addEventListener('click', onClick)
        return () => window.removeEventListener('click', onClick)
    }, [open]);

    return (
        <div className="h-dvh flex flex-col bg-gray-900 text-white">
            {/* Header */}
            <header className="flex items-center justify-between px-5 h-14 border-b border-gray-800">
                <button aria-label="open sidebar" className="md:hidden" onClick={() => setOpen(true)}>
                    <img src={hamburgerIcon} alt="menu" 
                        className="w-8 h-8 invert hover:opacity-80 transition"/>
                </button>

                <Link to="/" className="text-pink-400 font-extrabold tracking-wide text-xl md:text-2xl">
                    DOLIGO
                </Link>

                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/lps')} className="hidden md:flex items-center gap-1 text-sm text-gray-300 hover:text-white">
                        <span className="material-symbols-outlined text-base">search</span>
                        찾기
                    </button>

                    {!isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <NavLink to="/login" className="hover:text-black">로그인</NavLink>
                            <NavLink to="/signup" className="px-2 py-1 rounded border border-gray-700 hover:bg-gray-800">회원가입</NavLink>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-300">반갑습니다.</span>
                            <NavLink to="/mypage" className="font-semibold">마이페이지</NavLink>
                            <button onClick={logout} className="text-sm text-gray-300 hover:text-red-400">로그아웃</button>
                        </div>
                    )}
                </div>
            </header>

            {/* 사이드바 + 오버레이 */}
            { open && <div ref={overlayRef} className="fixed inset-0 z-30 md:hidden bg-black/40" />}
            <aside className={`fixed z-40 top-0 left-0 h-full w-64 bg-black/90 border-r border-gray-800 p-4 transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 `}>
                <nav className="mt-14 md:mt-4 space-y-2 text-gray-300">
                    <NavLink to="/lps" className={({isActive}) => `block px-3 py-2 rounded ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'}`}>찾기</NavLink>
                    <NavLink to="/mypage" className={({isActive}) => `block px-3 py-2 rounded ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'}`}>마이페이지</NavLink>
                    <button className="mt-8 text-xs text-gray-500">탈퇴하기</button>
                </nav>
            </aside>

            {/* 메인 */}
            <main className="flex-1 md:ml-64 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
            
            {/* FAB 플로팅 버튼 */}
            <button
                onClick={()=> navigate('/lp/new')}
                aria-label="add lp"
                className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-pink-500 text-white text-2xl shadow-lg hover:scale-105 active:scale-95"
            >
                +
            </button>
        </div>
    );
}
