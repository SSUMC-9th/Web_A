import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomeLayout from './layouts/HomeLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import FreeWebtoonPage from './pages/FreeWebtoonPage';
import PremiumWebtoonPage from './pages/PremiumWebtoonPage';
import PremiumRequiredPage from './pages/PremiumRequiredPage';
import TokenTestPage from './pages/TokenTestPage';
import GoogleCallbackPage from './pages/GoogleCallBackPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<HomeLayout />}>
            {/* 공개 페이지 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/webtoon/free" element={<FreeWebtoonPage />} />
            
            {/* Google OAuth Callback */}
            <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
            
            {/* 로그인 필요 */}
            <Route element={<ProtectedRoute />}>
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/token-test" element={<TokenTestPage />} />
            </Route>
            
            {/* 프리미엄 필요 */}
            <Route element={<ProtectedRoute requirePremium={true} />}>
              <Route path="/premium/webtoon/:id" element={<PremiumWebtoonPage />} />
            </Route>
            
            {/* 프리미엄 안내 페이지 */}
            <Route path="/premium-required" element={<PremiumRequiredPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;