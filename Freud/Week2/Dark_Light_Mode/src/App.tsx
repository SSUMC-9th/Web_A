import './index.css'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { ThemeToggle } from './components/ThemeToggle'
import { TodoProvider } from './context/TodoContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <TodoProvider>
        <div className="todo-container">
          <div className="flex justify-between items-center mb-4">
            <h1 className="todo-container__header">YONG TODO</h1>
            <ThemeToggle />
          </div>
          <TodoForm />
          <TodoList />
        </div>
      </TodoProvider>
    </ThemeProvider>
  )
}

export default App