import { Link, useLocation } from "react-router-dom";

interface MobileSidebarProps {
    open: boolean;
    onClose: () => void;
}

const MobileSidebar = ({ open, onClose }: MobileSidebarProps) => {
    const location = useLocation();

    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/50" />
            <aside
                className="absolute left-0 top-0 h-full w-72 bg-zinc-900 border-r border-zinc-800 p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-zinc-400 text-xs mb-3">메뉴</div>
                <nav className="space-y-2">
                    <Link
                        to="/"
                        className={`block px-3 h-9 rounded-md flex items-center hover:bg-zinc-800 ${
                            location.pathname === "/" ? "bg-zinc-800 text-white" : ""
                        }`}
                        onClick={onClose}
                    >
                        찾기
                    </Link>
                    <Link
                        to="/mypage"
                        className={`block px-3 h-9 rounded-md flex items-center hover:bg-zinc-800 ${
                            location.pathname.startsWith("/mypage") ? "bg-zinc-800 text-white" : ""
                        }`}
                        onClick={onClose}
                    >
                        마이페이지
                    </Link>
                </nav>
            </aside>
        </div>
    );
};

export default MobileSidebar;


