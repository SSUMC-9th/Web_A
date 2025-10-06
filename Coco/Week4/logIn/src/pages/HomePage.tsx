import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center space-y-8 px-4">
        <h1 className="text-5xl font-bold text-gray-900">
          안녕하세요
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          회원가입, 로그인 예시
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-medium transition"
          >
            회원가입
          </Link>
          <Link
            to="/signup"
            className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg text-lg font-medium transition"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
