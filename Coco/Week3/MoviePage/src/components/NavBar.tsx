import { NavLink } from "react-router-dom";

const Links = [
    { name: "Home", to: "/" },
    { name: "Movies", to: "/movies" },
];

export default function NavBar() {
    return (
        <nav className="bg-gray-800 text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-center space-x-8">
                {Links.map((link) => (
                    <NavLink 
                        key={link.to} 
                        to={link.to} 
                        className={({ isActive }) => 
                            isActive 
                                ? "text-blue-400 font-bold underline" 
                                : "hover:text-blue-300 transition"
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}