// 1. HTML 요소 선택
//as의 역할: 이 값이 HTMLInputElement 타입이라고 확신한다"고 TypeScript에게 알려주는 것임~
const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const doneList = document.getElementById("done-list") as HTMLUListElement;

// 2. 할 일이 어떻게 생긴애인지 Type을 정의
type Todo = {
  id: number;
  text: string;
};

let todos: Todo[] = []; //할 일
let doneTasks: Todo[] = []; //한 일

// -- 할 일 목록 렌더링 하는 함수를 정의
const renderTasks = (): void => {
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  // 할 일 목록 렌더링
  if (todos.length === 0) {
    // 한 일이 없으면
    const emptyMessage = document.createElement("li"); // 결과: <li></li> (빈 li 태그가 생성됨)
    emptyMessage.textContent = "할 일이 없습니다";
    emptyMessage.classList.add("empty-message"); // 결과: <li class="empty-message"></li>
    todoList.appendChild(emptyMessage);
  } else {
    todos.forEach((todo): void => {
      const li = createTodoElement(todo, false);
      todoList.appendChild(li); //appendChild를 실행하면 브라우저가 알아서 화면 리렌더링
    });
  }

  // 완료된 할 일 목록 렌더링
  if (doneTasks.length === 0) {
    // 한 일이 없으면
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "완료된 할 일이 없습니다";
    emptyMessage.classList.add("empty-message");
    doneList.appendChild(emptyMessage);
  } else {
    doneTasks.forEach((todo): void => {
      const li = createTodoElement(todo, true);
      doneList.appendChild(li);
    });
  }
};

// 3. 할 일 텍스트 입력 처리 함수. (공백 잘라줌)
const getTodoText = (): string => {
  return todoInput.value.trim(); // 공백 제거
};

// 4. 할 일 추가 처리 함수
const addTodo = (text: string): void => {
  todos.push({ id: Date.now(), text });
  todoInput.value = ""; //입력 필드 초기화
  todoInput.focus(); // 입력 필드에 자동 포커스
  renderTasks();
};

// 5. 할 일 상태 변경 (완료로 이동)
const completeTodo = (todo: Todo): void => {
  todos = todos.filter((t): boolean => t.id !== todo.id);
  doneTasks.push(todo);
  renderTasks();
};

// 6. 완료된 할 일 삭제 함수
const deleteTodo = (todo: Todo): void => {
  doneTasks = doneTasks.filter((t): boolean => t.id !== todo.id); // true값만 포함함 <-너무너무어렵다!!
  renderTasks();
};

// 7. 할 일 아이템 생성 함수 (완료 여부에 따라 버튼 텍스트나 색상 설정)
const createTodoElement = (todo: Todo, isDone: boolean): HTMLElement => {
  const li = document.createElement("li");
  li.classList.add("render-container_item");
  li.textContent = todo.text;

  const button = document.createElement("button");
  button.classList.add("render-container_item-button");

  if (isDone) {
    button.textContent = "삭제";
    button.style.backgroundColor = "#dc3545";
  } else {
    button.textContent = "완료";
    button.style.backgroundColor = "#28a745";
  }

  button.addEventListener("click", (): void => {
    if (isDone) {
      deleteTodo(todo);
    } else {
      completeTodo(todo);
    }
  });

  li.appendChild(button);
  return li;
};

// 8. 폼 제출 이벤트 리스너
// 이벤트 발생 시 실행될 함수, 매개변수 event, 반환값 void
todoForm.addEventListener("submit", (event: Event): void => {
  event.preventDefault(); // 새로고침 방지지
  const text = getTodoText(); // 입력필드에서 텍스트 가져옴옴
  if (text) {
    addTodo(text);
  }
});

renderTasks();
