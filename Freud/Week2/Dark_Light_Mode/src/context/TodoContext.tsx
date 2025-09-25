import { createContext, useContext, useState, ReactNode } from 'react'

interface Task {
    id: number
    text: string
}

interface TodoContextType {
    todos: Task[]
    doneTasks: Task[]
    inputValue: string
    setInputValue: (value: string) => void
    addTodo: (e: React.FormEvent) => void
    completeTask: (task: Task) => void
    deleteTodo: (taskId: number) => void
    deleteDoneTask: (taskId: number) => void
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function TodoProvider({ children }: { children: ReactNode }) {
    const [todos, setTodos] = useState<Task[]>([])
    const [doneTasks, setDoneTasks] = useState<Task[]>([])
    const [inputValue, setInputValue] = useState('')

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

    const value = {
        todos,
        doneTasks,
        inputValue,
        setInputValue,
        addTodo,
        completeTask,
        deleteTodo,
        deleteDoneTask,
    }

    return (
        <TodoContext.Provider value={value}>
            {children}
        </TodoContext.Provider>
    )
}

export function useTodos() {
    const context = useContext(TodoContext)
    if (!context) {
        throw new Error('useTodos must be used within TodoProvider')
    }
    return context
}