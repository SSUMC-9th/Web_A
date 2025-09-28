import { useTodo } from "../TodoContext";

export default function TodoList() {
    const {todos, doneTask} = useTodo();
    
    return (
        <div className="render-container__section">
            <h3 className="render-container__title">할 일</h3>
            <ul className="render-container__list">
                {todos.map((task) => (
                    <li key={task.id} className="render-container__item">
                        <span className="render-container__item-text">{task.text}</span>
                        <button
                            className="render-container__item-button"
                            onClick={() => doneTask(task)}
                            style={{backgroundColor: "forestgreen"}}>완료</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}