import { useTodos } from "../context/useTodos";
import TodoItem from "./TodoItem";

export default function TodoColumn() {
  const { todos, doneTasks } = useTodos();
  return (
    <div className="render-container">
      <div className="render-container__section">
        <h2 className="render-container__title">할 일</h2>
        <ul className="render-container__list">
          {todos.map((t) => (
            <TodoItem key={t.id} todo={t} isDone={false} />
          ))}
        </ul>
      </div>

      <div className="render-container__section">
        <h2 className="render-container__title">완료</h2>
        <ul className="render-container__list">
          {doneTasks.map((t) => (
            <TodoItem key={t.id} todo={t} isDone />
          ))}
        </ul>
      </div>
    </div>
  );
}
