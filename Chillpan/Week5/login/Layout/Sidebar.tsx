import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { logout, accessToken } = useAuth();

  const handleWithdraw = () => {
    alert("탈퇴 기능은 구현 X");
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 bg-gray-800 text-white w-64 transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } top-16 h-[calc(100vh-4rem)]`}
      >
        <nav className="p-4 h-full flex flex-col">
          <div className="space-y-4 flex-1">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded transition-colors"
            >
              <span>🎵</span>
              <span>LP판 보기</span>
            </Link>
            <Link
              to="/mypage"
              onClick={onClose}
              className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded transition-colors"
            >
              <span>👤</span>
              <span>마이페이지</span>
            </Link>
          </div>
          {accessToken && (
            <button
              onClick={() => {
                handleWithdraw();
                onClose();
              }}
              className="text-red-400 hover:text-red-300 p-2 rounded mt-auto transition-colors"
            >
              탈퇴하기
            </button>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;


