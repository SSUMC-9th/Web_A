import React, { useState} from 'react';
import TodoForm from './TodoForm'
import TodoList from './TodoList.tsx'
import { useTodoContext } from '../context/TodoContext.tsx';

const Todo: React.FC =()=>{
    const [input, setInput] = useState<string>('');
    const {todos, doneTodos, completeTodo, deleteTodo} = useTodoContext();
  
    return (
        <div className="todo-container">
            <h1 className="todo-container_header"> TODO</h1>
            <TodoForm input={input} setInput={setInput}/>
            <div className='render-container'>
                <TodoList 
                title='할 일' //명시 안하면 error
                todos ={todos} 
                buttonLabel='완료'
                buttonColor= 'green'
                onClick={completeTodo}
                />
                <TodoList 
                title='완료' 
                todos ={doneTodos} 
                buttonLabel='삭제'
                buttonColor= 'red'
                onClick ={deleteTodo}
                />

            </div>
        </div>
    )
};

export default Todo;