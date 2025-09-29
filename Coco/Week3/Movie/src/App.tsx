import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MoviePage from './pages/MoviePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MoviePage />
    </>
  )
}

export default App
