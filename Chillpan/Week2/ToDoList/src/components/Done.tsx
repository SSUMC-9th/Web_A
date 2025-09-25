//isDone이 true인 할 일만 보여줘야 한다.

interface TodoItem {
  id: number;
  content: string;
  isDone: boolean;
}

interface DoneProps {
  todos: TodoItem[];
  onDelete: (todo: number) => void;
}

const Done = ({ todos, onDelete }: DoneProps) => {
  let content;
  if (todos.length === 0) {
    content = <p>한 게 없습니다.</p>;
  } else {
    content = todos.map((todo) => {
      return (
        <div key={todo.id} className="done-item">
          {todo.content}
          <button onClick={() => onDelete(todo.id)}>삭제</button>
        </div>
      );
    });
  }
  return (
    <div className="done-section">
      <h2>완료</h2>
      {content}
    </div>
  );
};

export default Done;
