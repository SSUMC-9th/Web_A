import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
    const {accessToken} = useAuth();
    const location = useLocation();

    if (!accessToken) {
        const yes = window.confirm('로그인이 필요한 서비스입니다. 로그인 해주세요.');

        if (yes) {
            return <Navigate to="/login" replace state={{ from: location.pathname + location.search}}/>
        }
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}