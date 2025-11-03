import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo } from "../apis/auth.ts";
import type { ResponseMyInfoDto } from "../src/types/common";
import { useAuth } from "../src/context/AuthContext";
import type { AxiosError } from "axios";

const MyPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<ResponseMyInfoDto["data"] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        // 토큰 확인
        const token = localStorage.getItem("accessToken");
        console.log("저장된 토큰:", token);

        const response: ResponseMyInfoDto = await getMyInfo();
        console.log("사용자 정보:", response);

        // 사용자 정보를 state에 저장
        setUserInfo(response.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status !== 401) {
          console.error("사용자 정보 가져오기 실패:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleLogout = async () => {
    // 로그아웃 플래그 설정
    sessionStorage.setItem("isLoggingOut", "true");

    await logout();
    navigate("/login");

    // 로그아웃 완료 후 플래그 제거
    setTimeout(() => {
      sessionStorage.removeItem("isLoggingOut");
    }, 100);
  };

  if (loading) {
    return <div className="text-white">로딩 중...</div>;
  }

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold mb-12 mt-20">마이페이지</h1>
        {userInfo ? (
          <div className="bg-gray-800 p-10 rounded-lg shadow-md min-w-[400px]">
            <p className="mb-4 text-lg">
              <strong>이름:</strong> {userInfo.name}
            </p>
            <p className="mb-4 text-lg">
              <strong>이메일:</strong> {userInfo.email}
            </p>
            <p className="mb-6 text-lg">
              <strong>ID:</strong> {userInfo.id}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                홈페이지
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <p>사용자 정보를 불러올 수 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MyPage;
