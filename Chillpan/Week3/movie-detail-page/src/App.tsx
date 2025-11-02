import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import HomePage from "./Pages/HomePage";
import PopularMoviesPage from "./Pages/PopularMoviesPage";
import NowPlayingPage from "./Pages/NowPlayingPage";
import TopRatedPage from "./Pages/TopRatedPage";
import UpcomingPage from "./Pages/UpcomingPage";
import MovieDetailPage from "./Pages/MovieDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <>
              <Navbar />
              <HomePage />
            </>
          }
        />
        <Route
          path="popular"
          element={
            <>
              <Navbar />
              <PopularMoviesPage />
            </>
          }
        />
        <Route
          path="now-playing"
          element={
            <>
              <Navbar />
              <NowPlayingPage />
            </>
          }
        />
        <Route
          path="top-rated"
          element={
            <>
              <Navbar />
              <TopRatedPage />
            </>
          }
        />
        <Route
          path="upcoming"
          element={
            <>
              <Navbar />
              <UpcomingPage />
            </>
          }
        />
        <Route path="movies/:movieId" element={<MovieDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
