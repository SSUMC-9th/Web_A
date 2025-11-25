// App.tsx
import "./App.css";
import { useState } from "react";
import Header from "./components/Header";
import Editor from "./components/Editor";
import Todo from "./components/Todo";
import Done from "./components/Done";

// App.tsx
interface TodoItem {
  id: number;
  content: string;
  isDone: boolean;
}

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const todoItems = todos.filter((todo) => !todo.isDone);
  const doneItems = todos.filter((todo) => todo.isDone);

  const onCreate = (content: string) => {
    setTodos([...todos, { id: Date.now(), content, isDone: false }]);
  };

  const onComplete = (completedId: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === completedId ? { ...todo, isDone: true } : todo
      )
    );
  };

  const onDelete = (toDeleteId: number) => {
    setTodos(todos.filter((todo) => todo.id !== toDeleteId)); // 삭제할 ID가 아니라면 남긴다.
  };

  return (
    <>
      <Header />
      <Editor onCreate={onCreate} />
      <div className="todo-container">
        <Todo todos={todoItems} onComplete={onComplete} />
        <Done todos={doneItems} onDelete={onDelete} />
      </div>
    </>
  );
}

export default App;
