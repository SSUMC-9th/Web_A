// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './components/layout/MainLayout';
import { MainPage } from './pages/MainPage';
import { LpDetailPage } from './pages/LpDetailPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { MyPage } from './pages/MyPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LpSearch } from './components/lp/LpSearch';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<MainLayout />}>
            <Route path="/" element={<MainPage />} />
            {/* ✅ 검색 라우트 추가 */}
            <Route path="/search" element={<LpSearch />} />
            <Route
              path="/lp/:lpId"
              element={
                <ProtectedRoute>
                  <LpDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mypage"
              element={
                <ProtectedRoute>
                  <MyPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;