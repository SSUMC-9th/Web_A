import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import HomePage from './pages/home';
import MoviesPage from './pages/movies';
import MovieDetailPage from './pages/movie-detail';
import NotFound from './pages/not-found';
import RootLayout from './layout/root-layout';
import UpcomingPage from './pages/upcoming';
import TopRatedPage from './pages/top-rated';
import NowPlayingPage from './pages/now-playing';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'movies', element: <MoviesPage /> },
      { path: 'movies/:movieId', element: <MovieDetailPage /> },

      { path: 'upcoming', element: <UpcomingPage /> },
      { path: 'upcoming/:movieId', element: <MovieDetailPage /> },

      { path: 'top-rated', element: <TopRatedPage /> },
      { path: 'top-rated/:movieId', element: <MovieDetailPage /> },

      { path: 'now-playing', element: <NowPlayingPage /> },
      { path: 'now-playing/:movieId', element: <MovieDetailPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
