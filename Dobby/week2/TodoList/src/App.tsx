import { TodoProvider } from "./context/TodoProvider";
import TodoInput from "./components/TodoInput";
import TodoColumn from "./components/TodoColumn";
import "./App.css"; // 기존 CSS 붙여넣은 파일

// App.tsx
export default function App() {
  return (
    <TodoProvider>
      <div className="app-center">
        <div className="todo-container">
          <h1 className="todo-container__header">도비/김도현의 할 일</h1>
          <TodoInput />
          <TodoColumn />
        </div>
      </div>
    </TodoProvider>
  );
}
