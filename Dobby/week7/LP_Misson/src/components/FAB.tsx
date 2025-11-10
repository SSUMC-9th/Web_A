import { Link } from "react-router-dom";

const FAB = () => {
    return (
        <Link
            to="/lp/new"
            className="fixed bottom-6 right-6 z-30 h-12 w-12 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-2xl flex items-center justify-center shadow-lg"
            aria-label="LP 추가"
        >
            +
        </Link>
    );
};

export default FAB;


