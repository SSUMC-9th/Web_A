// HTML 요소 선택
var todoName = document.getElementById('todo-name');
var todoForm = document.getElementById('todo-form');
var todoList = document.getElementById('todo-list');
var doneList = document.getElementById('done-list');
var todos = [];
var doneTasks = [];
// 할 일 텍스트 입력 처리 함수 (공백 잘라줌)
var renderTasks = function () {
    todoList.innerHTML = '';
    doneList.innerHTML = '';
    todos.forEach(function (todo) {
        var li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });
    doneTasks.forEach(function (todo) {
        var li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });
};
// 할 일 입력 처리
var getTodoText = function () {
    return todoName.value.trim();
};
// 할 일 추가
var addTodo = function (text) {
    todos.push({ id: Date.now(), text: text });
    todoName.value = '';
    renderTasks();
};
// 할 일 상태 변경(완료로 이동)
var completeTask = function (todo) {
    todos = todos.filter(function (t) { return t.id !== todo.id; });
    // ㄴ 필터를 통해서 투두 리스트를 보고, 클릭한 애의 id와 투두의 id가 일치하지 않으면 그거를 제외한 나머지를 다 보여준다는 얘기
    doneTasks.push(todo);
    renderTasks();
};
// 완료된 할 일 삭제
var deleteTask = function (todo) {
    doneTasks = doneTasks.filter(function (t) { return t.id !== todo.id; });
    renderTasks();
};
// 할 일 아이템 생성 함수
var createTodoElement = function (todo, isDone) {
    var li = document.createElement('li');
    li.classList.add('control-todo__item');
    li.textContent = todo.text;
    var button = document.createElement('button');
    button.classList.add('control-todo__item-button');
    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    }
    else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }
    button.addEventListener('click', function () {
        if (isDone) {
            deleteTask(todo);
        }
        else {
            completeTask(todo);
        }
    });
    li.appendChild(button);
    return li;
};
// 폼 제출 이벤트 리스너
todoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var text = getTodoText();
    if (text) {
        addTodo(text);
    }
});
renderTasks();
