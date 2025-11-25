import { useEffect, useState } from "react";
import { useAuth } from "../src/context/AuthContext";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../src/types/common";
import { useNavigate } from "react-router-dom";
import React from "react";
import HamburgerIcon from "../components/icons/HamburgerIcon";

interface HeaderProps {
  currentOrder: "asc" | "desc";
  onOrderChange: (order: "asc" | "desc") => void;
  onSearchClick: () => void;
  onMenuClick: () => void;
}

const Header = ({
  currentOrder,
  onOrderChange,
  onSearchClick,
  onMenuClick,
}: HeaderProps) => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (accessToken) {
      getMyInfo()
        .then((response: ResponseMyInfoDto) => {
          setUserName(response.data.name);
        })
        .catch(() => {
          setUserName("");
        });
    } else {
      setUserName("");
    }
  }, [accessToken]);

  return (
    <header className="bg-gray-900 text-white h-16 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="text-white hover:text-gray-300 hover:cursor-pointer transition-colors"
          aria-label="메뉴 열기"
        >
          <HamburgerIcon className="w-8 h-8" />
        </button>
        <h1 className="text-xl font-bold">돌려돌려 LP판</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onSearchClick}
          disabled={!accessToken}
          className={`text-xl text-white hover:opacity-80 cursor-pointer ${
            !accessToken ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          🔍
        </button>
        {accessToken && userName ? (
          <span className="text-sm">
            <button
              onClick={() => navigate("/mypage")}
              className="underline hover:opacity-80 cursor-pointer transition-opacity"
            >
              {userName}
            </button>
            님 반갑습니다.{" "}
            <button
              onClick={async () => {
                await logout();
                navigate("/login");
              }}
              className="underline hover:opacity-80 cursor-pointer transition-opacity"
            >
              로그아웃
            </button>
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-1 rounded text-sm bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            >
              로그인
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-3 py-1 rounded text-sm bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            >
              회원가입
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => onOrderChange("asc")}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              currentOrder === "asc"
                ? "bg-gray-700 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => onOrderChange("desc")}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              currentOrder === "desc"
                ? "bg-gray-700 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            최신순
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
