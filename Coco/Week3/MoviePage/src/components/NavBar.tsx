import { NavLink } from "react-router-dom";

const Links = [
    { name: "홈", to: "/" },
    { name: "영화", to: "/movies" },
];

export default function NavBar() {
    return (
        <nav className="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">🎬 Movie Explorer</h1>
                <div className="flex space-x-6">
                    {Links.map((link) => (
                        <NavLink 
                            key={link.to} 
                            to={link.to} 
                            className={({ isActive }) => 
                                `text-lg font-medium transition ${
                                    isActive 
                                        ? "text-blue-400 border-b-2 border-blue-400" 
                                        : "text-gray-300 hover:text-white"
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
}