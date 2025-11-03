import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const {accessToken} = useAuth();

    if (!accessToken) {
        alert("로그인이 필요합니다.");
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}