import { useCallback, useEffect, useState } from "react";
import type { ApiError } from "../apis/axios";
import type { ResponseMyInfoDto } from "../types/auth"; 
import { getMyInfo } from "../apis/auth";
import ProfileEditModal from "../components/modals/ProfileEditModal";

export default function MyPage() {
    const [user, setUser] = useState<ResponseMyInfoDto["data"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

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

    // 모달에서 저장 성공시 바로 반영
    const handleProfileSaved = (patch : {
        name?: string;
        bio?: string | null;
        avatar?: string | null;
    }) => setUser((prev) => prev ? { ...prev, ...patch, } : prev);

    if (loading) {
        return <div className="text-center text-gray-400 mt-10">불러오는 중...</div>;
    }

    if (!user) return null;

    return (
        <div className="flex justify-center py-10 text-gray-100">
            <div className="w-full max-w-md rounded-2xl bg-slate-900/80 border border-slate-700/60 p-6 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-800b border border-slate-600">
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

                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold">{user.name}</h1>
                            <button
                                onClick={() => setOpen(true)}
                                className="inline-flex items-center rounded-full border border-slate-600 px-2 py-1 text-xs text-gray-300 hover:bg-slate-700 hover:text-white transition"
                            >
                                ⚙ 프로필 수정
                            </button>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">이메일 : {user.email}</p>
                    </div>
                </div>
                    
                
                {/* bio */}
                <div className="mb-4">
                    <h2 className="text-sm font-semibold text-gray-300 mb-1">소개</h2>
                    <p className="text-sm text-gray-500 whitespace-pre-line min-h-[40px]">
                        { user.bio && user.bio.trim().length > 0 ? user.bio : "한 줄 소개를 입력하세요."}
                    </p>
                </div>
                
            </div>


            <ProfileEditModal
                open={open}
                onClose={() => setOpen(false)}
                initial={{ name: user?.name ?? "", bio: user?.bio ?? "", avatar: user.avatar ?? null, }}
                onSaved={handleProfileSaved}
            />
        </div>
    )
}