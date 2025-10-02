import { NavLink } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-pink-50 to-green-100">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-green-700 mb-6">🎬 Movie Home</h1>
        <p className="text-gray-600 mb-8">
          👇나의 취향에 맞는 영화 찾기👇
        </p>

        <div className="grid grid-cols-2 gap-4">
          <NavLink
            to="/movies"
            className="px-4 py-3 bg-green-200 hover:bg-green-300 text-green-800 font-semibold rounded-lg shadow-md transition text-center"
          >
            인기 영화
          </NavLink>

          <NavLink
            to="/upcoming"
            className="px-4 py-3 bg-green-300 hover:bg-green-400 text-white font-semibold rounded-lg shadow-md transition text-center"
          >
            개봉 예정
          </NavLink>

          <NavLink
            to="/top-rated"
            className="px-4 py-3 bg-green-400 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition text-center"
          >
            평점 높은
          </NavLink>

          <NavLink
            to="/now-playing"
            className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition text-center"
          >
            상영 중
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
