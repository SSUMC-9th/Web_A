import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./Layout/Layout";
import Home from "./pages/Home";
import MoviesPage from "./pages/MoviesPage";
import MovieDetail from "./pages/MovieDetail";     // ✅ 새로 만들 컴포넌트
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "popular", element: <MoviesPage category="popular" /> },
      { path: "now_playing", element: <MoviesPage category="now_playing" /> },
      { path: "top_rated", element: <MoviesPage category="top_rated" /> },
      { path: "upcoming", element: <MoviesPage category="upcoming" /> },
      { path: "movies/:movieId", element: <MovieDetail /> }, // ✅ 동적 상세
    ],
  },
]);
