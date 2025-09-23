import React, { type FormEvent } from 'react';
import { useTodoContext } from '../context/TodoContext.tsx';

interface TodoFormProps {
    input: string;
    setInput: (value: string) => void;
}

const TodoForm :React.FC<TodoFormProps> = ({input, setInput}
    : TodoFormProps) =>{
    const {addTodo} = useTodoContext(); 
    const handleSubmit = (e: FormEvent<HTMLFormElement>) :void => {
        e.preventDefault();
        console.log('working');
        const text = input.trim();

        if(text){
            addTodo(text);
            setInput('');
        }
        };
    return <form className='todo-container_form' id='todo-form' onSubmit={handleSubmit}>
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
}
export default TodoForm;