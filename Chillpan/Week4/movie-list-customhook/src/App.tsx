import "./App.css";
import { Routes, Route, useParams } from "react-router-dom";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import HomePage from "./Pages/HomePage";
import MoviesListPage from "./Pages/MoviesListPage";
import MovieDetailPage from "./Pages/MovieDetailPage";

// 동적 라우팅
function DynamicMoviesRoute() {
  const { category } = useParams<{ category: string }>();

  return (
    <>
      <Navbar />
      {/*default는 popular로  Props 전달*/}
      <MoviesListPage category={category || ""} />{" "}
    </>
  );
}

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
        {/* 동적 라우팅으로 모든 카테고리 처리 */}
        <Route path=":category" element={<DynamicMoviesRoute />} />{" "}
        {/*//: 사용하면 동적 파라미터가 된다.*/}
        <Route path="movies/:movieId" element={<MovieDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
