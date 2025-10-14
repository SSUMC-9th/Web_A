import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomeLayout from './layouts/HomeLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { index: true, element: <HomePage /> },
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