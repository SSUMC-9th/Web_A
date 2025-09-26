// HTML 요소 선택
const todoName = document.getElementById('todo-name') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList=  document.getElementById('done-list') as HTMLUListElement;

// 할 일이 어떻게 생긴건지 type를 정의
type Todo = {
    id : number;
    text : string;
};

let todos : Todo[] = [];
let doneTasks : Todo[] = [];

// 할 일 텍스트 입력 처리 함수 (공백 잘라줌)
const renderTasks = () : void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo) : void => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    })

    doneTasks.forEach((todo) : void => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    })
}

// 할 일 입력 처리
const getTodoText = () : string => {
    return todoName.value.trim();
}

// 할 일 추가
const addTodo = (text : string) : void => {
    todos.push({id : Date.now(), text});
    todoName.value = '';
    renderTasks();
}

// 할 일 상태 변경(완료로 이동)
const completeTask = (todo : Todo) : void => {
    todos = todos.filter((t) :boolean => t.id !== todo.id);
    // ㄴ 필터를 통해서 투두 리스트를 보고, 클릭한 애의 id와 투두의 id가 일치하지 않으면 그거를 제외한 나머지를 다 보여준다는 얘기
    doneTasks.push(todo);
    renderTasks();
}

// 완료된 할 일 삭제
const deleteTask = (todo : Todo) : void => {
    doneTasks = doneTasks.filter((t) : boolean => t.id !== todo.id);
    renderTasks();
}

// 할 일 아이템 생성 함수
const createTodoElement = (todo : Todo, isDone : boolean) : HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('control-todo__item');
    li.textContent = todo.text;

    const button = document.createElement('button');
    button.classList.add('control-todo__item-button');

    // 아래의 삼항연산자로 고쳐 씀
    // if (isDone) {
    //     button.textContent = '삭제';
    //     button.style.backgroundColor = '#dc3545';
    // }
    // else {
    //     button.textContent = '완료';
    //     button.style.backgroundColor = '#28a745';
    // }

    // button.addEventListener('click', () : void => {
    //     if (isDone) {
    //         deleteTask(todo);
    //     } else {
    //         completeTask(todo);
    //     }
    // });
    button.textContent = isDone ? '삭제' : '완료';
    button.style.backgroundColor = isDone ? '#dc3545' : '#28a745';

    button.addEventListener('click', () => {
        isDone ? deleteTask(todo) : completeTask(todo);
    });
    li.appendChild(button);
    return li;
};

// 폼 제출 이벤트 리스너
todoForm.addEventListener('submit', (event : Event) : void => {
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});

renderTasks();

