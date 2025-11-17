import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Company from './pages/Company';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/company'
          element={<Company />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
