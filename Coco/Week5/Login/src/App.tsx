import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import HomeLayout from './layouts/HomeLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import FreeWebtoonPage from './pages/FreeWebtoonPage';
import PremiumWebtoonPage from './pages/PremiumWebtoonPage';
import PremiumRequiredPage from './pages/PremiumRequiredPage';
import ProtectedRoute from './components/ProtectedRoute';
import React from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <h1>Not Found</h1>,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'webtoon/free/:id', element: <FreeWebtoonPage /> },
      { path: 'premium-required', element: <PremiumRequiredPage /> },
      
      // 로그인 필요한 페이지들
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'mypage', element: <MyPage /> },
        ],
      },
      
      // 프리미엄 필요한 페이지들
      {
        element: <ProtectedRoute requirePremium={true} />,
        children: [
          { path: 'premium/webtoon/:id', element: <PremiumWebtoonPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;