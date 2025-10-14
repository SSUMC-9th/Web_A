import { NavLink } from "react-router-dom";

const NavBar = () => {
    const linkStyle = ({ isActive } : {isActive : boolean}) =>
        isActive ? "text-green-600 font-bold bg-gray-200 mx-2" : "text-gray-300 hover:text-blue-800 hover:font-bold mx-2";

    return (
        <nav className="w-full flex items-center justify-between px-6 py-3 bg-gray-500">
            <div className="text-blue-200 font-bold text-4xl">
                <NavLink to="/" className={linkStyle}>
                    🏠HomePage
                </NavLink>
            </div>

            <div className="flex items-center space-x-4">
                <NavLink
                    to="/login"
                    className={({ isActive }) =>
                        `${linkStyle ({ isActive })} border border-gray-400 px-3 py-1 rounded hover:bg-gray-200`}>
                    로그인
                </NavLink>
                <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                        `${linkStyle ({ isActive })} border border-gray-400 px-3 py-1 rounded hover:bg-gray-200`}>
                    회원가입
                </NavLink>
            </div>
        </nav>
    )
};

export default NavBar;