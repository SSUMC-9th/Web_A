import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Notfoundpage from "../pages/Notfoundpage";
import Loginpage from "../pages/Loginpage";
import HomeLayout from "../Layout/HomeLayout";
import HomePage from "../pages/Homepage";
import SignupPage from "../pages/SignupPage";
import Mypage from "../pages/Mypage";

// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지

const router = createBrowserRouter([
  // router 객체 만들기기
  {
    path: "/", // / 로 들어가면면
    element: <HomeLayout />, // Home 페이지 보여주기. 근데 통 공유하는 레이아웃이 있어서 HomeLayout 으로 감싸줘야 함
    errorElement: <Notfoundpage />, // Error 페이지 보여주기
    children: [
      { index: true, element: <HomePage /> }, // Home 페이지 보여주기
      { path: "login", element: <Loginpage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "mypage", element: <Mypage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
