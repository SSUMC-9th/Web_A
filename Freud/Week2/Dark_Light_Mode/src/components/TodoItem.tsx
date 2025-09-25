interface Task {
    id: number
    text: string
}

interface TodoItemProps {
    task: Task
    type: 'todo' | 'done'
    onComplete?: (task: Task) => void
    onDelete: (taskId: number) => void
}

export function TodoItem({ task, type, onComplete, onDelete }: TodoItemProps) {
    return (
        <li className="render-container__item">
            <span className="render-container__item-text">{task.text}</span>
            <div>
                {type === 'todo' && onComplete && (
                    <button
                        onClick={() => onComplete(task)}
                        style={{ backgroundColor: '#28a745' }}
                        className="render-container__item-button"
                    >
                        완료
                    </button>
                )}
                {type === 'done' && (
                    <button
                        onClick={() => onDelete(task.id)}
                        className="render-container__item-button"
                    >
                        삭제
                    </button>
                )}
            </div>
        </li>
    )
}