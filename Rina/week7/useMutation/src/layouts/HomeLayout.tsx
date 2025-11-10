import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import hamburgerIcon from "../assets/icons/hamburger-button.svg";
import LPModal from "../components/modals/LPModal";
import { useMutation} from "@tanstack/react-query";
import { postLogout } from "../apis/auth";
import { deleteMe } from "../apis/user";

export default function HomeLayout () {
    const [open, setOpen] = useState(false);
    const { isLoggedIn, logout, userName} = useAuth();
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const [lpModalOpen, setLpModalOpen] = useState(false);

    const [isNarrow, setIsNarrow] = useState<boolean>(
        typeof window !== "undefined" ? window.innerWidth < 1024 : true
    );

    const hideSidebar = ["/login", "/signup", "/v1/auth/google/callback"].includes(pathname);

    const isHome = pathname === "/";
    const isLpsList = pathname === "/lps";

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
    })

    // 오버레이 : 모바일(협소)이거나, 데탑이어도 홈/lp목록이 아닐때 표시
    const showOverlay = open && (isNarrow || !(isHome || isLpsList));

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 1023.98px)");
        
        const apply = (matches: boolean) => setIsNarrow(matches);
        const onChange = (e: MediaQueryListEvent) => apply(e.matches);

        apply(mq.matches);
        if (mq.addEventListener) mq.addEventListener("change", onChange);
        else mq.addListener(onChange); // fallback

        return () => {
            if (mq.removeEventListener) mq.removeEventListener("change", onChange);
            else mq.removeListener(onChange); // fallback
        };
    }, []);

    useEffect(() => {
        if (isNarrow)setOpen(false);
        else {
            // 데스크톱: 홈/목록이면 자동 오픈, 상세 등은 기존 상태 유지
            const isHomeOrList = isHome || isLpsList;
            setOpen(!hideSidebar && isHomeOrList);
        }
    }, [isNarrow, pathname, hideSidebar, isHome, isLpsList]);
    
    // 데탑에서 사이드바 펼쳣을 때 메인 겹침 방지
    const mainLeftPad = !isNarrow && open && !hideSidebar ? "lg:pl-64": "";
        
     // ESC로 닫기
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div className="h-dvh flex flex-col bg-gray-900 text-white">

            {/* 헤더 */}
            <header className={`flex relative z-80 items-center justify-between px-5 h-14 border-b border-gray-800 ${mainLeftPad}`}>
                { !hideSidebar ? (
                    <button
                        aria-label={open ? "close sidebar" : "open sidebar"}
                        className="inline-flex"
                        onClick={() => setOpen(v => !v)}
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
                    <button
                        onClick={() => navigate('/lps')}
                        className="hidden md:flex items-center gap-1 text-sm text-gray-300 hover:text-white"
                        aria-label="search"
                    >
                        <span className="material-symbols-outlined text-base">search</span>
                        찾기
                    </button>

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
                    {showOverlay && (
                        <div
                            className="fixed inset-0 z-60 bg-black/40"
                            onClick={() => setOpen(false)}
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
                                onClick={() => setOpen(false)}
                            >찾기</NavLink>
                            <NavLink
                                to="/mypage"
                                className={({isActive}) => `block px-3 py-2 rounded ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'}`}
                                onClick={() => setOpen(false)}
                            >마이페이지</NavLink>
                        </nav>

                        <div className="absolute bottom-6 left-0 right-0 text-center">
                            <button
                                className="text-xs text-gray-500"
                                onClick={() => {
                                    const yes = window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
                                    if (yes) deleteMuta.mutate();
                                }}
                            >탈퇴하기</button>
                        </div>
                    </aside>
                </>
                
            )}
            

            {/* 메인 */}
            <main id="app-scroll" className={`flex-1 overflow-y-auto ${mainLeftPad}`}>
                <div className="max-w-6xl mx-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
            
            {/* FAB 플로팅 버튼 */}
            <button
                onClick={()=> setLpModalOpen(true)}
                aria-label="add lp"
                className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center leading-none rounded-full bg-pink-500 text-white text-2xl shadow-lg hover:scale-105 active:scale-95"
            >
                +
            </button>

            <LPModal open={lpModalOpen} onClose={() => setLpModalOpen(false)} />


        </div>
    );
}
