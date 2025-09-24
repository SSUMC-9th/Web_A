import { useTodos } from "../context/useTodos";
import type { Todo } from "../types/todo";

type Props = {
  todo: Todo;
  isDone: boolean;
};

export default function TodoItem({ todo, isDone }: Props) {
  const { completeTodo, deleteTodo } = useTodos();

  return (
    <li className="render-container__item">
      <span className="render-container__item-text">{todo.text}</span>
      {isDone ? (
        <button
          className="render-container__item-button"
          onClick={() => deleteTodo(todo)}
          aria-label="삭제"
        >
          삭제
        </button>
      ) : (
        <button
          className="render-container__item-button"
          style={{ backgroundColor: "#28a745" }} // 원본 코드 색상 유지
          onClick={() => completeTodo(todo)}
          aria-label="완료"
        >
          완료
        </button>
      )}
    </li>
  );
}
