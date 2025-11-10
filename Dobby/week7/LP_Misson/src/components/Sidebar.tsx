import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { accessToken, logout } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col md:w-56 shrink-0 h-[calc(100dvh-56px)] sticky top-14 border-r border-zinc-800 text-zinc-200">
      <nav className="flex-1 p-3 space-y-1">
        <Link
          to="/"
          className={`block px-3 h-9 rounded-md flex items-center hover:bg-zinc-800 ${
            location.pathname === "/" ? "bg-zinc-800 text-white" : ""
          }`}
        >
          찾기
        </Link>

        <Link
          to="/mypage"
          className={`block px-3 h-9 rounded-md flex items-center hover:bg-zinc-800 ${
            location.pathname.startsWith("/mypage") ? "bg-zinc-800 text-white" : ""
          }`}
        >
          마이페이지
        </Link>
      </nav>
      <div className="p-3 border-t border-zinc-800">
        {accessToken ? (
          <button
            onClick={() => void logout()}
            className="w-full h-9 rounded-md bg-zinc-800 hover:bg-zinc-700"
          >
            로그아웃
          </button>
        ) : (
          <div className="text-xs text-zinc-400 px-1">로그인 후 이용해 보세요</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
