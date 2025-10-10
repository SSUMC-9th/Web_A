import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 flex flex-col justify-center items-center w-full min-h-screen bg-gray-100">
      <h1 className="text-2xl text-red-600 font-bold">찾을 수 없는 페이지 404</h1>
      <p className="p-3">페이지 경로를 확인하세요</p>
      <button
        onClick={() => navigate(-1)} // 👈 이전 페이지로
        className="bg-green-300 rounded p-1 hover:bg-green-400"
      >
        이전 페이지로 이동하기
      </button>
    </div>
  );
};

export default NotFound;
