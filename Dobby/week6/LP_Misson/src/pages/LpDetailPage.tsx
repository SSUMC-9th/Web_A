import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";

const REDIRECT_KEY = "redirectPath";

const LpDetailPage = () => {
    const { lpid } = useParams();
    const lpId = Number(lpid);
    const navigate = useNavigate();
    const { accessToken } = useAuth();

    useEffect(() => {
        if (!accessToken) {
            const ok = window.confirm("이 페이지는 로그인 후 이용 가능합니다. 로그인 하시겠습니까?");
            if (ok) {
                window.localStorage.setItem(REDIRECT_KEY, `/lp/${lpId}`);
                navigate("/login");
            } else {
                navigate(-1);
            }
        }
    }, [accessToken, lpId, navigate]);

    const { data, refetch, isLoading, isError } = useGetLpDetail(lpId);

    if (!accessToken) return null;
    if (isLoading) return <Spinner />;
    if (isError || !data) return <ErrorView onRetry={() => void refetch()} />;

    const lp = data.data;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <img src={lp.thumbnail} alt={lp.title} className="w-full rounded-md object-cover" />
            <h1 className="text-xl font-semibold mt-4">{lp.title}</h1>
            <div className="text-sm text-zinc-400 mt-1">
                {new Date(lp.createdAt).toLocaleString()} · ❤ {lp.likes.length}
            </div>
            <div className="prose prose-invert max-w-none mt-6 whitespace-pre-wrap">
                {lp.content}
            </div>
            <div className="mt-6 flex gap-2">
                <button className="h-9 px-3 rounded bg-zinc-800 hover:bg-zinc-700">수정</button>
                <button className="h-9 px-3 rounded bg-zinc-800 hover:bg-zinc-700">삭제</button>
                <button className="h-9 px-3 rounded bg-pink-600 hover:bg-pink-500">좋아요</button>
            </div>
        </div>
    );
};

export default LpDetailPage;


