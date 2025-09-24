import { createContext } from "react";
import type { Todo } from "../types/todo";

export type TodoContextValue = {
  todos: Todo[];
  doneTasks: Todo[];
  addTodo: (text: string) => void;
  completeTodo: (todo: Todo) => void;
  deleteTodo: (todo: Todo) => void;
};

export const TodoContext = createContext<TodoContextValue | null>(null);
