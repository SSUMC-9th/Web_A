import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import hamburgerIcon from "../assets/icons/hamburger-button.svg";
import LPModal from "../components/modals/LPModal";
import { useMutation} from "@tanstack/react-query";
import { postLogout } from "../apis/auth";
import { deleteMe } from "../apis/user";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import ConfirmModal from "../components/modals/ConfirmModal";
import useSidebar from "../hooks/useSidebar";

export default function HomeLayout () {
    const { isLoggedIn, logout, userName} = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    const {pathname, search: locationSearch} = location;

    // URL 쿼리에서 초기값 가져오기
    const params = new URLSearchParams(locationSearch);
    const searchValueFromUrl = params.get("q") ?? "";

    const [search, setSearch] = useState("");   // 헤더 검색창 상태

    const [lpModalOpen, setLpModalOpen] = useState(false);
    const [loginNeedOpen, setLoginNeedOpen] = useState(false);
    const [leaveOpen, setLeaveOpen] = useState(false);

    const {
        open,
        hideSidebar,
        showOverlay,
        mainLeftPad,
        toggleSidebar,
        closeSidebar,
    } = useSidebar(pathname);

    const logoutMuta = useMutation({
        mutationFn: async() => { await postLogout();},
        onSettled: async () => {
            await logout();
        },
    });

    const deleteMuta = useMutation({
        mutationFn: () => deleteMe(),
        onSuccess: async () => {
            await logout();
            window.location.href = "/login";
        }
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);   // 입력 즉시 반영

        const trimmed = value.trim();
        const query = trimmed ? `?q=${encodeURIComponent(trimmed)}`: "";

        navigate(`/lps${query}`, {
            replace: pathname.startsWith("/lps"),
        });
    };

    // URL 쿼리가 바뀌면 input 값도 동기화
    useEffect(() => {
        setSearch(searchValueFromUrl);
    }, [searchValueFromUrl]);

    return (
        <div className="h-dvh flex flex-col bg-gray-900 text-white">

            {/* 헤더 */}
            <header className={`flex relative z-80 items-center justify-between px-5 h-14 border-b border-gray-800 ${mainLeftPad}`}>
                { !hideSidebar ? (
                    <button
                        aria-label={open ? "close sidebar" : "open sidebar"}
                        className="inline-flex"
                        onClick={toggleSidebar}
                    >
                        <img src={hamburgerIcon}
                            alt="menu" 
                            className="w-8 h-8 invert hover:opacity-80 transition"
                        />
                    </button>
                ) : (
                    <div className="w-8 h-8" />
                )}
                
                <Link to="/" className="text-pink-400 font-extrabold tracking-wide text-xl md:text-2xl">
                    DOLIGO
                </Link>

                <div className="flex items-center gap-4">
                    <input
                        type="text" 
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="LP 검색"
                        className="hidden md:block px-3 py-1 rounded border border-gray-700 bg-gray-800 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-pink-400"
                    />

                    {!isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <NavLink to="/login" className="hover:text-white">로그인</NavLink>
                            <NavLink to="/signup" className="px-2 py-1 rounded border border-gray-700 hover:bg-gray-800">회원가입</NavLink>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-300">{userName ? `${userName}님 반갑습니다.` : "반갑습니다."}</span>
                            <NavLink to="/mypage" className="font-semibold">마이페이지</NavLink>
                            <button onClick={() => logoutMuta.mutate()} className="text-sm text-gray-300 hover:text-red-400">로그아웃</button>
                        </div>
                    )}
                </div>
            </header>

            {/* 사이드바 + 오버레이 */}
            {!hideSidebar && (
                <>
                    {showOverlay && !leaveOpen && (
                        <div
                            className="fixed inset-0 z-60 bg-black/40"
                            onClick={closeSidebar}
                        />
                    )}

                    <aside
                        className={[
                            "fixed z-70 top-0 left-0 h-full w-64 bg-black/90 border-r border-gray-800 p-4 transform transition-transform duration-200",
                            open ? "translate-x-0" : "-translate-x-full",
                        ].join(" ")}
                    >
                        <nav className="mt-12 space-y-2 text-gray-300">
                            <NavLink
                                to="/lps"
                                className={({isActive}) => `block px-3 py-2 rounded ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'}`}
                                onClick={closeSidebar}
                            >찾기</NavLink>
                            <NavLink
                                to="/mypage"
                                className={({isActive}) => `block px-3 py-2 rounded ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'}`}
                                onClick={closeSidebar}
                            >마이페이지</NavLink>
                        </nav>

                        <div className="absolute bottom-6 left-0 right-0 text-center">
                            <button
                                className="text-xs text-gray-500"
                                onClick={() => {
                                    closeSidebar();
                                    setLeaveOpen(true);
                                }}
                            >탈퇴하기</button>
                        </div>
                    </aside>
                </>
                
            )}
            

            {/* 메인 */}
            <main
                id="app-scroll"
                className={`flex-1 ${showOverlay ? "overflow-hidden" : "overflow-y-auto"} ${mainLeftPad}`}
            >
                <div className="max-w-6xl mx-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
            
            {/* FAB 플로팅 버튼 */}
            <button
                onClick={()=> {
                    const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
                    if(!token) {
                        setLoginNeedOpen(true);
                        return;
                    }
                    setLpModalOpen(true);
                }}
                aria-label="add lp"
                className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center leading-none rounded-full bg-pink-500 text-white text-2xl shadow-lg hover:scale-105 active:scale-95"
            >
                +
            </button>

            <LPModal open={lpModalOpen} onClose={() => setLpModalOpen(false)} />

            {/* 로그인 필요 모달 */}
            <ConfirmModal
                open={loginNeedOpen}
                onClose={() => setLoginNeedOpen(false)}
                single
                message="LP를 추가하려면 로그인해 주세요."
            />

            {/* 탈퇴 확인 모달 */}
            <ConfirmModal
                open={leaveOpen}
                onClose={() => setLeaveOpen(false)}
                message="정말 탈퇴하시겠습니까?"
                onConfirm={() => {
                    setLeaveOpen(false)
                    deleteMuta.mutate();
                }}
            />
        </div>
    );
}
