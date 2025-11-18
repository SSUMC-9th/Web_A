import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const {socialLogin} = useAuth();

  useEffect(() => {
    // URL 쿼리에서 토큰 추출
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const name = params.get("name");

    if (accessToken && refreshToken) {
        socialLogin({
            accessToken,
            refreshToken,
        });
      alert(`${name ?? "사용자"}님, 환영합니다!`);
      window.location.replace("/mypage");
      return;
    //   navigate("/mypage", {replace: true}); // 로그인 후 내 페이지로 이동
    }
    else {
      alert("토큰 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/login", {replace: true});
    }
  }, [navigate, socialLogin]);

  return (
    <div className="flex h-screen items-center justify-center text-gray-200 bg-gray-900">
      <p>구글 로그인 처리 중...</p>
    </div>
  );
}
