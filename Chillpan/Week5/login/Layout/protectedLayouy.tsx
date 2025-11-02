import React from "react";
import { useAuth } from "../src/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const { accessToken }: { accessToken: string | null } = useAuth();

  if (!accessToken) {
    // 로그아웃 중이 아닐 때만 경고 메시지 표시
    const isLoggingOut = sessionStorage.getItem("isLoggingOut");
    if (!isLoggingOut) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
    }
    return <Navigate to={"/login"} replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
