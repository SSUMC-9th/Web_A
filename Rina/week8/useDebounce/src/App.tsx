import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import HomeLayout from './layouts/HomeLayout'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import { GoogleOAuthProvider } from '@react-oauth/google'
import GoogleCallbackPage from './pages/GoogleCallbackPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import LpListPage from './pages/LpListPage'
import LpDetailPage from './pages/LpDetailPage'

const router = createBrowserRouter([
  {
    path:'/',
    element: <HomeLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage />},
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage />},
      { path: 'v1/auth/google/callback', element: <GoogleCallbackPage/>}, 

      { path: 'lps', element: <LpListPage /> },
      { path: 'lp/:lpid', element: <LpDetailPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'mypage', element: <MyPage />},
          
        ],
      },
      
    ],
  }
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus:false,
    },
  },
})

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} /> }
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )

}

export default App;