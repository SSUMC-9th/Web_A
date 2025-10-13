import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <p className="text-gray-600 mb-6">홈페이지입니다.</p>

            <div className="space-y-4">
              {accessToken ? (
                <div>
                  <p className="text-green-600 mb-4"> 로그인된 상태입니다!</p>
                  <button
                    onClick={() => navigate("/mypage")}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-md transition-colors duration-200 w-full"
                  >
                    마이페이지로 이동
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 mb-4">로그인이 필요합니다.</p>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors duration-200 w-full"
                  >
                    로그인하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
