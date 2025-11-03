import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomeLayout from './layouts/HomeLayout';
import MainLayout from './layouts/MainLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import LpListPage from './pages/LpListPage';
import LpDetailPage from './pages/LpDetailPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <LpListPage /> },
      { path: "lp/:lpid", element: <LpDetailPage /> },
    ],
  },
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { path: "home", element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
      { path: "v1/auth/google/callback", element: <GoogleCallbackPage /> },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "my",
        element: <MyPage />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App