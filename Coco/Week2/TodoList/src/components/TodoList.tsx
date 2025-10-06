import type { TTodo } from "../type/todo";

interface TodoListProps{
    title: string;
    todos: TTodo[];
    buttonLabel: string;
    buttonColor: 'green'| 'red';
    onClick: (todo: TTodo)=>void
}

const TodoList :React.FC<TodoListProps> = ({
    title,
    todos,
    buttonColor,
    buttonLabel,
    onClick,
}:TodoListProps) =>{

    return <section className="render-container_section">
        <h2 className="render-container_title">{title}</h2>
        <ul id="todo-list" className="render-container_list">
            {todos.map((todo):any=> (
                <li key={todo.id} className='render-container_item'>
                <span className='render-container_item-text'>
                    {todo.text}
                </span>
                <button
                onClick={(): void => onClick(todo)}
                style={{
                    backgroundColor: buttonColor
                }}
                className='render-container_item-button'
                >
                    {buttonLabel}
                </button>
            </li>

            ))}
            
        </ul>
        </section>
}
export default TodoList;