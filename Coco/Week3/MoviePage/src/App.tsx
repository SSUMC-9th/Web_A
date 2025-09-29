import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './page/HomePage'
import MoviePage from './page/MoviePage'
import MovieDetailPage from './page/MovieDetailPage'
import NavBar from './components/NavBar'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <NavBar />
        <HomePage />
      </>
    ),
  },
  {
    path: '/movies',
    element: (
      <>
        <NavBar />
        <MoviePage />
      </>
    ),
  },
  {
    path: '/movies/:id',
    element: (
      <>
        <NavBar />
        <MovieDetailPage />
      </>
    ),
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App