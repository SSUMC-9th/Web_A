console.log("App.tsx loaded");
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import HomeLayout from "./layouts/HomeLayouts";
import ProtectedLayout from "./layouts/ProtectedLayout";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LpCreatePage from "./pages/LpCreatePage";
import LpDetailPage from "./pages/LpDetailPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignupPage from "./pages/SignupPage";
import ThrottlePage from "./pages/ThrottlePage";
// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지

//publicRoutes: 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "lp/:lpid", element: <LpDetailPage /> },
      { path: "lp/new", element: <LpCreatePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> },
      { path: "throttle", element: <ThrottlePage /> },
    ],
  },
];
//protectedRoutes: 인증 필요한 라우트
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "mypage",
        element: <MyPage />,
      },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
