import { TodoItem } from './TodoItem'
import { useTodos } from '../context/TodoContext'

export function TodoList() {
    const { todos, doneTasks, completeTask, deleteTodo, deleteDoneTask } = useTodos()
    
    return (
        <div className="render-container">
            <div className="render-container__section">
                <h2 className="render-container__title">할 일</h2>
                <ul className="render-container__list">
                    {todos.map(task => (
                        <TodoItem
                            key={task.id}
                            task={task}
                            type="todo"
                            onComplete={completeTask}
                            onDelete={deleteTodo}
                        />
                    ))}
                </ul>
            </div>
            <div className="render-container__section">
                <h2 className="render-container__title">완료</h2>
                <ul className="render-container__list">
                    {doneTasks.map(task => (
                        <TodoItem
                            key={task.id}
                            task={task}
                            type="done"
                            onDelete={deleteDoneTask}
                        />
                    ))}
                </ul>
            </div>
        </div>
    )
}