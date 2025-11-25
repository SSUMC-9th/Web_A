import React from "react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
}

const Sidebar = ({
  isOpen,
  onClose,
  searchTerm,
  onSearchTermChange,
}: SidebarProps) => {
  const navigate = useNavigate();
  return (
    <>
      {isOpen && ( // 열려있는 상태에선..
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      <aside // 닫혀있는 상태에선..
        className={`fixed top-0 left-0 h-screen w-64 rounded-r-lg bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-lg bg-white px-4 py-1 text-base font-semibold text-gray-900 shadow hover:bg-gray-100 transition-colors hover:cursor-pointer"
          >
            메뉴
          </button>
          <div className="mt-6 flex flex-col items-start gap-4 text-lg text-gray-200 hover:cursor-pointer">
            <div className="w-full rounded-md bg-gray-900 p-3">
              <div className="flex items-center gap-3 text-left text-gray-200">
                <span className="text-xl">🔍</span>
                <span>LP 검색</span>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                placeholder="제목을 입력하세요"
                className="mt-3 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-gray-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                navigate("/mypage");
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-gray-700 hover:text-white hover:cursor-pointer"
            >
              <span className="text-xl">👤</span>
              <span>마이페이지</span>
            </button>
            <button
              onClick={() => {
                navigate("/");
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-gray-700 hover:text-white hover:cursor-pointer"
            >
              <span className="text-xl">🏠</span>
              <span>홈페이지</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
