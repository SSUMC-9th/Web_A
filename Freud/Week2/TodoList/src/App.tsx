import { useState } from 'react'
import './index.css'

interface Task {
  id: number
  text: string
}

function App() {
  const [todos, setTodos] = useState<Task[]>([])
  const [doneTasks, setDoneTasks] = useState<Task[]>([])
  const [inputValue, setInputValue] = useState('');

  //할 일 추가 함수
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    const text = inputValue.trim()
    if (text) {
      setTodos([...todos, { id: Date.now(), text }])
      setInputValue('')
    }
  }

  //할 일 완료로 이동
  const completeTask = (task: Task) => {
    setTodos(todos.filter(t => t.id !== task.id))
    setDoneTasks([...doneTasks, task])
  }

  //할 일 삭제
  const deleteTodo = (taskId: number) => {
    setTodos(todos.filter(t => t.id !== taskId))
  }

  //완료된 일 삭제
  const deleteDoneTask = (taskId: number) => {
    setDoneTasks(doneTasks.filter(t => t.id !== taskId))
  }

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">YONG TODO</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="todo-container__input"
          placeholder="할 일 입력"
          required
        />
        <button type="submit" className="todo-container__button">할 일 추가</button>
      </form>
      <div className="render-container">
        <div className="render-container__section">
          <h2 className="render-container__title">할 일</h2>
          <ul className="render-container__list">
            {todos.map(task => (
              <li key={task.id} className="render-container__item">
                <span className="render-container__item-text">{task.text}</span>
                <div>
                  <button
                    onClick={() => completeTask(task)}
                    style={{ backgroundColor: '#28a745' }}
                    className="render-container__item-button"
                  >
                    완료
                  </button>
                  {/* <button
                    onClick={() => deleteTodo(task.id)}
                    className="render-container__item-button"
                  >
                    삭제
                  </button> */}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="render-container__section">
          <h2 className="render-container__title">완료</h2>
          <ul className="render-container__list">
            {doneTasks.map(task => (
              <li key={task.id} className="render-container__item">
                <span className="render-container__item-text">{task.text}</span>
                <div>
                  <button
                    onClick={() => deleteDoneTask(task.id)}
                    className="render-container__item-button"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}

          </ul>
        </div>
      </div>
    </div >

  )
}

export default App