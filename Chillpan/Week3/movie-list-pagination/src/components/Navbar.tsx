import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex gap-3 p-4">
      <NavLink to="/" className="text-white">
        홈
      </NavLink>
      <NavLink to="/popular" className="text-white">
        인기 영화
      </NavLink>
      <NavLink to="/now-playing" className="text-white">
        상영 중
      </NavLink>
      <NavLink to="/top-rated" className="text-white">
        평점 높은
      </NavLink>
      <NavLink to="/upcoming" className="text-white">
        개봉 예정
      </NavLink>
    </div>
  );
}
