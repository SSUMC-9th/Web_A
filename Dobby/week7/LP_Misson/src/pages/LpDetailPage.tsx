import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommentsSection from "../components/CommentsSection";
import ErrorView from "../components/ErrorView";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import usePostLike from "../hooks/mutations/usePostLike";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";

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

  const { data: me } = useGetMyInfo(accessToken);
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();

  const handleLikeLp = () => {
    likeMutate(Number(lpId));
  };

  const handleDislikeLp = () => {
    disLikeMutate(Number(lpId));
  };

  if (!accessToken) return null;
  if (isLoading) return <Spinner />;
  if (isError || !data) return <ErrorView onRetry={() => void refetch()} />;

  // 데이터가 확실히 존재하는 시점에 계산
  const lp = data.data;
  const isLiked = lp.likes.some((like) => like.userId === me?.data.id);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <img src={lp.thumbnail} alt={lp.title} className="w-full rounded-md object-cover" />
      <h1 className="text-xl font-semibold mt-4">{lp.title}</h1>
      <div className="text-sm text-zinc-400 mt-1">
        {new Date(lp.createdAt).toLocaleString()} · ❤ {lp.likes.length}
      </div>
      <div className="prose prose-invert max-w-none mt-6 whitespace-pre-wrap">{lp.content}</div>
      <div className="mt-6 flex gap-2">
        <button className="h-9 px-3 rounded bg-zinc-800 hover:bg-zinc-700">수정</button>
        <button className="h-9 px-3 rounded bg-zinc-800 hover:bg-zinc-700">삭제</button>
        {isLiked ? (
          <button
            onClick={handleDislikeLp}
            className="h-9 px-3 rounded bg-zinc-700 hover:bg-zinc-600"
          >
            좋아요 취소
          </button>
        ) : (
          <button onClick={handleLikeLp} className="h-9 px-3 rounded bg-pink-600 hover:bg-pink-500">
            좋아요
          </button>
        )}
      </div>
      <CommentsSection lpId={lpId} />
    </div>
  );
};

export default LpDetailPage;
