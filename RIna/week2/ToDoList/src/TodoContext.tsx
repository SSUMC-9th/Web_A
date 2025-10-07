import { createContext, useContext, useState, ReactNode } from "react";

export type Task = {
  id: number;
  text: string;
};

interface TodoContextType {
    todos : Task[];
    doneTasks : Task[];
    addTodo : (text:string) => void;
    doneTask : (task: Task) => void;
    deleteTask : (task : Task) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({children} : {children: ReactNode}) {
    const [todos, setTodos] = useState<Task[]>([]);
    const [doneTasks, setDoneTasks] = useState<Task[]>([]);

    // 할 일 추가 함수
    const addTodo = (text: string) => {
      setTodos([...todos, { id: Date.now(), text}]);
    };

    // 할 일 완료/삭제 함수
    const doneTask = (task: Task) => {
      setTodos(todos.filter((t) => t.id !== task.id));
      setDoneTasks([...doneTasks, task]);
    };

    const deleteTask = (task: Task) => {
      setDoneTasks(doneTasks.filter((t) => t.id !== task.id));
    };

    return (
        <TodoContext.Provider value={{todos, doneTasks, addTodo, doneTask, deleteTask}}>
            {children}
        </TodoContext.Provider>
    );
}

export function useTodo() {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error("useTodo는 TodoProvider 안에서만 사용해야 함.");
    }
    return context;
}