import { useTodos } from '../context/TodoContext'

export function TodoForm() {
    const { inputValue, setInputValue, addTodo } = useTodos()
    
    return (
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
    )
}
