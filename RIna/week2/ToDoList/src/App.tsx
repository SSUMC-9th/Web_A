import Header from "./components/Header";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import DoneList from "./components/DoneList";
import { TodoProvider } from "./TodoContext";

export default function App() {
    return (
      <TodoProvider>
        <div className="todo-container">
          <Header />
          <TodoForm  />
          <div className="render-container">
            <TodoList />
            <DoneList />
          </div>
        </div>
      </TodoProvider>
    );
}
