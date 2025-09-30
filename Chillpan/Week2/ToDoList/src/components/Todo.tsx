// Todo.tsx
interface TodoItem {
  id: number;
  content: string;
  isDone: boolean;
}

interface TodoProps {
  todos: TodoItem[];
  onComplete: (todo: number) => void;
}

const Todo = ({ todos, onComplete }: TodoProps) => {
  let content;

  if (todos.length === 0) {
    content = <p>할 일이 없습니다.</p>;
  } else {
    /*content에는 이런 것들이 저장됨:
      [
      <div key="첫번째">첫번째</div>,  // JSX.Element
      <div key="두번째">두번째</div>  
      ] */

    content = todos.map((todo) => {
      return (
        <div key={todo.id} className="todo-item">
          {todo.content}
          <button onClick={() => onComplete(todo.id)}>완료</button>
        </div> //onComplete 실행되면, App.tsx의 onComplete 실행
      );
    });
  }

  return (
    <div className="todo-section">
      <h2>할 일</h2>
      {content}
    </div>
  );
};

export default Todo;
