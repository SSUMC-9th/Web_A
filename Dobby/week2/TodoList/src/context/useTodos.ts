import { useContext } from "react";
import { TodoContext } from "./TodoContext";

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("TodoProvider로 감싸주세요.");
  return ctx;
}
