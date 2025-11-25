import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";
import { Settings } from "lucide-react";
import ProfileEditModal from "../components/ProfileEditModal";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import React from "react";

const MyPage = () => {
  const { logout, accessToken } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(accessToken);
  const { data: myInfoResponse, refetch: refetchMyInfo } =
    useGetMyInfo(isLoggedIn);
  const userInfo = myInfoResponse?.data ?? null;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdateSuccess = () => {
    refetchMyInfo();
  };

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

  if (!myInfoResponse && isLoggedIn) {
    return <div className="text-white">로딩 중...</div>;
  }

  return (
    <div className="relative min-h-full w-full flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-950 to-black -mt-16 -mb-20 pt-16 pb-20">
      <div className="text-center text-white">
        <div className="flex items-center justify-center gap-3 mb-12">
          <h1 className="text-2xl font-bold">마이페이지</h1>
          {userInfo && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-white hover:text-gray-300 transition-colors cursor-pointer"
              aria-label="설정"
              title="프로필 수정"
            >
              <Settings className="h-6 w-6" strokeWidth={2} />
            </button>
          )}
        </div>
        {userInfo ? (
          <div className="bg-gray-800 p-10 rounded-lg shadow-md min-w-[400px]">
            <p className="mb-4 text-lg">
              <strong>이름:</strong> {userInfo.name}
            </p>
            {userInfo.bio && (
              <p className="mb-4 text-lg">
                <strong>Bio:</strong> {userInfo.bio}
              </p>
            )}
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

      {userInfo && (
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userInfo={userInfo}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default MyPage;
