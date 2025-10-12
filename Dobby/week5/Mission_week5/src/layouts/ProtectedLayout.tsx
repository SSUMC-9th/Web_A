import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  if (!accessToken) {
    return <Navigate to={"/login"} replace />;
  }
  return (
    <div className="h-dvh flex flex-col bg-black text-white">
      <nav className="sticky top-0 z-10 w-full bg-zinc-900/90 backdrop-blur px-4">
        <div className="mx-auto max-w-5xl h-14 flex items-center justify-between">
          <Link to="/" className="font-bold tracking-tight text-pink-500">
            돌려돌려LP판
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={`inline-flex items-center justify-center h-8 px-3 rounded-md text-sm font-medium border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition-colors ${
                location.pathname === "/" ? "ring-1 ring-zinc-500" : ""
              }`}
            >
              홈
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="h-10" />
    </div>
  );
};

export default ProtectedLayout;
