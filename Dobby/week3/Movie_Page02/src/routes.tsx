import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./UI/Layout";
import MoviesPage from "./pages/MoviesPage";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// /popular, /now_playing, /top_rated, /upcoming 라우트
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
    ],
  },
]);
