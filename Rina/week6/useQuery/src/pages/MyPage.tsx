import { useEffect, useState } from "react";
import type { ApiError } from "../apis/axios";
import type { ResponseMyInfoDto } from "../types/auth"; 
import { getMyInfo } from "../apis/auth";

export default function MyPage() {
    const [user, setUser] = useState<ResponseMyInfoDto["data"] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
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

            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return <div className="text-center text-gray-400 mt-10">불러오는 중...</div>;
    }

    if (!user) return null;

    return (
        <div className="flex flex-col items-center justify-center h-screen text-gray-700">
            <h1 className="text-2xl font-bold mb-4">내 정보</h1>
            <p>이름 : {user.name}</p>
            <p>이메일 : {user.email}</p>
        </div>
    )
}