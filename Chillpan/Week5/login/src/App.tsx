import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import Notfoundpage from "../pages/Notfoundpage";
import Loginpage from "../pages/Loginpage";
import HomeLayout from "../Layout/HomeLayout";
import HomePage from "../pages/Homepage";
import SignupPage from "../pages/SignupPage";
import Mypage from "../pages/Mypage";
import ProtectedLayout from "../Layout/protectedLayouy";
import { AuthProvider } from "./context/AuthContext";
import GoogleLoginPage from "../pages/GoogleLoginPage";

// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지
// publicRoutes : 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Notfoundpage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <Loginpage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "/v1/auth/google/callback", element: <GoogleLoginPage /> },
    ],
  },
];

// privateRoutes: 로그인 된 사용자가 접근 가능한 페이지
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <Notfoundpage />,
    children: [
      {
        path: "mypage",
        element: <Mypage />,
      },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
