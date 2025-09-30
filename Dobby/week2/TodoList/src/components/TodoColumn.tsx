import { useTodos } from "../context/useTodos";
import TodoItem from "./TodoItem";

type SectionProps = {
  title: string;
  items: ReturnType<typeof useTodos>["todos"]; // Todo[]
  isDone: boolean;
  emptyText: string;
};

function Section({ title, items, isDone, emptyText }: SectionProps) {
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">
        {title} ({items.length})
      </h2>

      <ul className="render-container__list">
        {items.length === 0 ? (
          // ✅ 빈 상태 분기
          <li className="render-container__empty">{emptyText}</li>
        ) : (
          // ✅ 데이터가 있을 때 분기
          items.map((t) => <TodoItem key={t.id} todo={t} isDone={isDone} />)
        )}
      </ul>
    </div>
  );
}

export default function TodoColumn() {
  const { todos, doneTasks } = useTodos();

  // ✅ 전체가 비었을 때의 상위 분기 (선택)
  if (todos.length === 0 && doneTasks.length === 0) {
    return (
      <div className="render-container render-container--empty">
        <p className="render-container__empty-all">
          아직 항목이 없습니다. 위 입력창에서 할 일을 추가해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="render-container">
      <Section
        title="할 일"
        items={todos}
        isDone={false}
        emptyText="할 일이 없습니다."
      />
      <Section
        title="완료"
        items={doneTasks}
        isDone
        emptyText="완료된 항목이 없습니다."
      />
    </div>
  );
}
