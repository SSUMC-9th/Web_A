import { Link, Outlet, useLocation } from "react-router-dom";
import FAB from "../components/FAB";
import MobileSidebar from "../components/MobileSidebar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import useDisclosure from "../hooks/useDisclosure";

const HomeLayout = () => {
  const location = useLocation();
  const { accessToken, userName } = useAuth();
  const { isOpen, toggle, close } = useDisclosure(false);

  return (
    <div className="h-dvh flex flex-col bg-black text-white">
      <nav className="sticky top-0 z-10 w-full bg-zinc-900/90 backdrop-blur px-4">
        <div className="mx-auto max-w-5xl h-14 flex items-center justify-between">
          <Link to="/" className="font-bold tracking-tight text-pink-500">
            돌려돌려LP판
          </Link>
          <div className="flex items-center gap-3">
            <button
              className="md:hidden h-8 w-8 rounded hover:bg-zinc-800 flex items-center justify-center"
              aria-label="사이드바 열기"
              onClick={toggle}
            >
              <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="M7.95 11.95h32m-32 12h32m-32 12h32"
                />
              </svg>
            </button>
            {accessToken && (
              <span className="hidden sm:inline text-sm text-zinc-300">
                로그인 {userName ?? "사용자"}님 환영합니다
              </span>
            )}
            {accessToken ? (
              <Link
                to="/mypage"
                className={`inline-flex items-center justify-center h-8 px-3 rounded-md text-sm font-medium border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition-colors ${
                  location.pathname.startsWith("/mypage") ? "ring-1 ring-zinc-500" : ""
                }`}
              >
                마이페이지
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`inline-flex items-center justify-center h-8 px-3 rounded-md text-sm font-medium border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition-colors ${
                    location.pathname === "/login" ? "ring-1 ring-zinc-500" : ""
                  }`}
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className={`inline-flex items-center justify-center h-8 px-3 rounded-md text-sm font-medium bg-pink-600 hover:bg-pink-500 transition-colors ${
                    location.pathname === "/signup" ? "ring-2 ring-pink-300" : ""
                  }`}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <MobileSidebar open={isOpen} onClose={close} />
      <div className="flex mx-auto w-full max-w-5xl gap-6">
        <Sidebar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
      <FAB />
      <footer className="h-10" />
    </div>
  );
};

export default HomeLayout;
