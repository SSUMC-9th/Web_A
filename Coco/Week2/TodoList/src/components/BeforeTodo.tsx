import React, { useState, type FormEvent } from 'react';
import type { TTodo } from '../type/todo.ts';

const BeforeTodo : React.FC = () => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
    const [input, setInput] = useState<string>('');
    console.log('Input', input)
    const handleSubmit = (e: FormEvent<HTMLFormElement>) :void => {
        e.preventDefault();
        console.log('working');
        const text = input.trim();

        if(text){
            const newTodo: TTodo ={ id: Date.now(), text};
            setTodos((prevTodos): TTodo[]=> [...prevTodos, newTodo]);
            setInput('');
        }
    }

    const completeTodo = (todo:TTodo): void =>{
        setTodos((prevTodos): TTodo[] => prevTodos.filter((t): boolean => t.id
        !== todo.id
    ));
    setDoneTodos((prevDoneTodos): TTodo[]=>[...prevDoneTodos, todo]);
    };

    const deleteTodo = (doneTodo : TTodo): void =>{
        setDoneTodos((prevDoneTodo): TTodo[]=> 
        prevDoneTodo.filter((t): boolean => t.id !== doneTodo.id)
    );
    };

    return <div className="todo-container">
        <h1 className='todo-container_header'>TODO</h1>
        <form className='todo-container_form' id='todo-form' onSubmit={handleSubmit}>
        <input
            value={input}

            onChange={(e): void => setInput(e.target.value)}
            type="text"
            id="todo-input"
            className="todo-container_input"
            placeholder="할 일을 입력해주세요."
            />
        <button type="submit" className="todo-container_btn">할 일 추가</button>
        
        </form>
    
    <div className="render-container">
        <section className="render-container_section">
        <h2 className="render-container_title">할 일</h2>
        <ul id="todo-list" className="render-container_list">
            {todos.map((todo):any=> (
                <li key={todo.id} className='render-container_item'>
                <span className='render-container_item-text'>
                    {todo.text}
                </span>
                <button
                onClick={():void => completeTodo(todo)}
                style={{
                    backgroundColor:'green'
                }}
                className='render-container_item-button'
                >
                    완료
                </button>
            </li>

            ))}
            
        </ul>
        </section>
        <section className="render-container_section">
        <h2 className="render-container_title">완료</h2>
        <ul id="done-list" className="render-container_list">
            {doneTodos.map((doneTodo):any=>(
                <li key={doneTodo.id} className='render-container_item'>
                <span className='render-container_item-text'>
                    {doneTodo.text}
                </span>
                <button
                onClick={(): void => deleteTodo(doneTodo)}
                style={{
                    backgroundColor:'red'
                }}
                className='render-container_item-button'
                >
                    삭제
                </button>
            </li>

            ))}
            
        </ul>
        </section>
    </div>
    </div>
}
export default BeforeTodo;