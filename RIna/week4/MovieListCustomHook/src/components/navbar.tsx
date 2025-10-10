import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-green-600 font-bold mx-2" : "text-gray-300 hover:text-green-600 mx-2";

  return (
    <nav className='p-4 flex gap-2 flex-nowrap overflow-x-auto bg-gray-700'>
      <NavLink to="/" className={linkStyle}>홈</NavLink>
      <NavLink to="/movies" className={linkStyle}>인기 영화</NavLink>
      <NavLink to="/upcoming" className={linkStyle}>개봉 예정</NavLink>
      <NavLink to="/top-rated" className={linkStyle}>평점 높은</NavLink>
      <NavLink to="/now-playing" className={linkStyle}>상영 중</NavLink>
    </nav>
  );
};

export default Navbar;
