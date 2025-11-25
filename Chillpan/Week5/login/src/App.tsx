import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import Notfoundpage from "../pages/Notfoundpage";
import Loginpage from "../pages/Loginpage";
import MainLayout from "../Layout/MainLayout";
import HomePage from "../pages/Homepage";
import SignupPage from "../pages/SignupPage";
import Mypage from "../pages/Mypage";
import ProtectedLayout from "../Layout/protectedLayouy";
import { AuthProvider } from "./context/AuthContext";
import GoogleLoginPage from "../pages/GoogleLoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
//import InfinitePostsJsonPlaceholder from "../components/InfinitePostsJsonPlaceholder";
//import InfinitePostsAutoJsonPlaceholder from "../components/InfinitePostsAutoJsonPlaceholder";
const queryClient = new QueryClient();

// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지
// publicRoutes : 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
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
    element: <ProtectedLayout />,
    children: [
      {
        path: "mypage",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Mypage />,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {" "}
      // 이거 아래 모든 클라이언트가 쿼리 클라이언트 인스턴스를 사용할 수 있게
      해줌
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
  // return (
  //   <QueryClientProvider client={queryClient}>
  //     <InfinitePostsAutoJsonPlaceholder />
  //     {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
  //   </QueryClientProvider>
  // );
}

export default App;
