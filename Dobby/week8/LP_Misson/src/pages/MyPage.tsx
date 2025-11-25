import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import type { ResponseMyInfoDto } from "../types/auth";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        setData(response);
      } catch (e) {
        console.error(e);
        setError("내 정보 조회에 실패했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="h-full w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-white shadow-xl">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold">마이페이지</h1>
        </div>

        {/* 로딩 스켈레톤 */}
        {isLoading && (
          <div className="animate-pulse">
            <div className="mx-auto h-24 w-24 rounded-full bg-zinc-800" />
            <div className="mt-6 h-4 w-3/5 mx-auto rounded bg-zinc-800" />
            <div className="mt-3 h-3 w-2/5 mx-auto rounded bg-zinc-800" />
            <div className="mt-8 h-9 w-full rounded-md bg-zinc-800" />
          </div>
        )}

        {/* 에러 상태 */}
        {!isLoading && error && (
          <div className="text-center">
            <div className="text-red-400 text-sm">{error}</div>
            <button
              onClick={() => {
                setIsLoading(true);
                setError(null);
                // 재시도
                (async () => {
                  try {
                    const response = await getMyInfo();
                    setData(response);
                  } catch (e) {
                    console.error(e);
                    setError("다시 시도에 실패했습니다.");
                  } finally {
                    setIsLoading(false);
                  }
                })();
              }}
              className="mt-4 h-9 px-4 rounded-md text-sm font-medium border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 본문 */}
        {!isLoading && !error && (
          <div className="text-center">
            <div className="mx-auto h-24 w-24 rounded-full overflow-hidden ring-2 ring-zinc-700">
              {/* 아바타 이미지 */}
              <img
                src={(data?.data?.avatar as string) || "https://via.placeholder.com/96"}
                alt="프로필 이미지"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-4">
              <div className="text-xl font-semibold">{data?.data?.name}</div>
              <div className="text-zinc-400 text-sm">{data?.data?.email}</div>
            </div>
            {data?.data?.bio && <div className="mt-3 text-zinc-300 text-sm">{data.data.bio}</div>}

            <div className="mt-8 flex items-center gap-3">
              <button
                className="flex-1 h-10 rounded-md bg-pink-600 hover:bg-pink-500 transition-colors text-sm font-medium"
                onClick={() => navigate("/")}
              >
                홈으로 가기
              </button>
              <button
                className="flex-1 h-10 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm font-medium"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
