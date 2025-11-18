import { useCallback, useEffect, useState } from "react";
import type { ApiError } from "../apis/axios";
import type { ResponseMyInfoDto } from "../types/auth"; 
import { getMyInfo } from "../apis/auth";
import ProfileEditModal from "../components/modals/ProfileEditModal";

export default function MyPage() {
    const [user, setUser] = useState<ResponseMyInfoDto["data"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const userData = await getMyInfo();
    //             setUser(userData.data);
    //         } catch (e) {
    //             const err = e as ApiError;
    //             console.error("유저 정보 불러오기 실패:", err.response?.data ?? err);
    //             if (err.response?.status === 401) {
    //                 alert("로그인 정보 만료. 다시 로그인 해주세요.");
    //                 localStorage.clear();
    //                 window.location.href = "/login";
    //             }

    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchUser();
    // }, []);

    const fetchUser = useCallback(async () => {
        try {
            const userData = await getMyInfo();
            setUser(userData.data);
        } catch (e) {
            const err = e as ApiError;
            console.error("유저 정보 불러오기 실패:", err.response?.data ?? err);
            if (err.response?.status === 401) {
                alert("로그인 정보 만료. 다시 로그인 해주세요.");
                localStorage.clear();
                window.location.href = "/login";
            }
        }finally {
        setLoading(false);
        }
    }, []);

    // 최초 1회 로드
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // 프로필 저장 성공 이벤트 수신 -> 내 정보 재조회
    useEffect(() => {
        const handler = () => {
          setLoading(true);
          fetchUser();
        };
        window.addEventListener("me:updated", handler as EventListener);
        return () => window.removeEventListener("me:updated", handler as EventListener);
    }, [fetchUser]);

    if (loading) {
        return <div className="text-center text-gray-400 mt-10">불러오는 중...</div>;
    }

    if (!user) return null;

    return (
        <div className="flex flex-col items-center justify-center h-screen text-gray-300">
            <div className="flex flex-col items-center mb-6">
                <div className="w-28 h-28 rounded-full bg-gray-700 overflow-hidden mb-3">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                            No Image
                        </div>
                    )}
                </div>
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold mb-4">내 정보</h1>
                    <button
                        onClick={() => setOpen(true)}
                        className="ml-2 text-gray-400 hover:text-white"
                    >
                        ⚙
                    </button>
                </div>
                
            </div>
            <p>이름 : {user.name}</p>
            <p>이메일 : {user.email}</p>

            <ProfileEditModal
                open={open}
                onClose={() => setOpen(false)}
                initial={{ name: user?.name ?? "", bio: user?.bio ?? "" }}
            />
        </div>
    )
}