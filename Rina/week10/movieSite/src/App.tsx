import HomePage from "./pages/HomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MovieDetailPage from "./pages/MovieDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/movies/:movieId",
    element: <MovieDetailPage />,
  }
])

function App() {

  return (
    <div className="flex flex-col items-center" >
      <RouterProvider router={router}/>
    </div>
  )
}

export default App;
