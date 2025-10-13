import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo } from "../apis/auth.ts";
import type { ResponseMyInfoDto } from "../src/types/common";
import { useAuth } from "../src/context/AuthContext";

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
        console.error("사용자 정보 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <nav className="bg-slate-800 text-white p-4 shadow-lg">
          <div className="container mx-auto">
            <h1 className="text-xl font-semibold">네비게이션 바 입니다.</h1>
          </div>
        </nav>
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div>로딩 중...</div>
        </main>
        <footer className="bg-slate-700 text-white p-4 shadow-lg">
          <div className="container mx-auto text-center">
            <p>광고 배너</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 네비게이션 바 */}
      <nav className="bg-slate-800 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-xl font-semibold">네비게이션 바 입니다.</h1>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
          {userInfo ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-2">
                <strong>이름:</strong> {userInfo.name}
              </p>
              <p className="mb-2">
                <strong>이메일:</strong> {userInfo.email}
              </p>
              <p className="mb-4">
                <strong>ID:</strong> {userInfo.id}
              </p>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <p>사용자 정보를 불러올 수 없습니다.</p>
          )}
        </div>
      </main>

      {/* 광고 배너 */}
      <footer className="bg-slate-700 text-white p-4 shadow-lg">
        <div className="container mx-auto text-center">
          <p>광고 배너</p>
        </div>
      </footer>
    </div>
  );
};

export default MyPage;
