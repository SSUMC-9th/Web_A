import { useMemo, useState, type ReactNode } from "react";
import type { Todo } from "../types/todo";
import { TodoContext } from "./TodoContext";

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [doneTasks, setDoneTasks] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setTodos((prev) => [{ id: Date.now(), text: t }, ...prev]);
  };

  const completeTodo = (todo: Todo) => {
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    setDoneTasks((prev) => [todo, ...prev]);
  };

  const deleteTodo = (todo: Todo) => {
    setDoneTasks((prev) => prev.filter((t) => t.id !== todo.id));
  };

  const value = useMemo(
    () => ({ todos, doneTasks, addTodo, completeTodo, deleteTodo }),
    [todos, doneTasks]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
