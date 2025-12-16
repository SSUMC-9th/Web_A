import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import HomePage from './page/HomePage'
import MoviePage from './page/MoviePage'
import MovieDetailPage from './page/MovieDetailPage'

function RootLayout() {
  return (
    <div>
      <nav className="bg-gray-800 p-4">
        <div className="flex gap-8 items-center max-w-7xl mx-auto">
          <h1 className="text-white text-xl font-bold">🎬 Movie App</h1>
          <div className="flex gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-blue-400 font-bold' : 'text-white'
              }
            >
              홈
            </NavLink>
            <NavLink
              to="/movies"
              className={({ isActive }) =>
                isActive ? 'text-blue-400 font-bold' : 'text-white'
              }
            >
              영화
            </NavLink>
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'movies',
        element: <MoviePage />,
      },
      {
        path: 'movies/:id',
        element: <MovieDetailPage />,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App