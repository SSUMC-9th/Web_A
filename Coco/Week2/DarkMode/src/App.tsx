import DarkModeApp from './components/DarkModeApp'
import DarkModeProvider from './context/DarkModeContext'
import './index.css'

function App() {

  return (
    <>
    <DarkModeProvider>
      <DarkModeApp />
    </DarkModeProvider>
    </>
  )
}

export default App
