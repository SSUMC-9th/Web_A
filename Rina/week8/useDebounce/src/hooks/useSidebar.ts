import { useEffect, useState } from "react";

const HIDE_PATHS = ["/login", "/signup", "/v1/auth/google/callback"];

export function useSidebar(pathname: string) {
    const [open, setOpen] = useState(false);

    const [isNarrow, setIsNarrow] = useState<boolean>(
        typeof window !== "undefined" ? window.innerWidth < 1024 : true
    );

    const hideSidebar = HIDE_PATHS.includes(pathname);
    const isHome = pathname === "/";
    const isLpsList = pathname === "/lps";

    // 화면 크기에 따라 isNarrow 상태 관리
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 1023.98px)");
        const apply = (matches : boolean) => setIsNarrow(matches);
        const onChange = (e: MediaQueryListEvent) => apply(e.matches);

        apply(mq.matches);
        mq.addEventListener("change", onChange);

        return () => {
            mq.removeEventListener("change", onChange);
        }
    }, []);

    // 라우트/화면 크기 변화에 따라 사이드바 자동 열림/닫힘
    useEffect(() => {
        const isHomeOrList = isHome || isLpsList;
        const nextOpen = isNarrow ? false : (!hideSidebar && isHomeOrList);

        setOpen(prev =>(prev === nextOpen ? prev : nextOpen));
    }, [isNarrow, hideSidebar, isHome, isLpsList]);

    // esc 키로 닫기
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // 오버레이/메인 패딩 계산
    const showOverlay = open && (isNarrow || !(isHome || isLpsList));
    const mainLeftPad = !isNarrow && open && !hideSidebar ? "lg:pl-64" : "";

    // open/close/toggle 제어 함수
    const openSidebar = () => setOpen(true);
    const closeSidebar = () => setOpen(false);
    const toggleSidebar = () => setOpen(prev => !prev);

    return {
        open,
        isNarrow,
        hideSidebar,
        showOverlay,
        mainLeftPad,
        openSidebar,
        closeSidebar,
        toggleSidebar,
    };
}

export default useSidebar;