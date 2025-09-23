import type { PropsWithChildren } from 'react';
import type { TTodo } from '../type/todo';
import React, { useState } from 'react';

interface ITodoContext{
    todos: TTodo[];
    doneTodos: TTodo[];
    addTodo: (text: string)=> void;
    completeTodo: (todo: TTodo)=> void;
    deleteTodo: (doneTodo: TTodo)=> void;
}
const TodoContext = React.createContext<ITodoContext | undefined>
(undefined);

const TodoProvider = ({ children }:PropsWithChildren)  =>{
        const [todos, setTodos] = useState<TTodo[]>([]);
        const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
            
        const addTodo = (text: string): void =>{
            const newTodo: TTodo ={ id: Date.now(), text};
            setTodos((prevTodos): TTodo[]=> [...prevTodos, newTodo]);
        };
        const completeTodo = (todo:TTodo): void =>{
            setTodos((prevTodos): TTodo[] => prevTodos.filter((t): boolean => t.id
            !== todo.id
        ));
        setDoneTodos((prevDoneTodos): TTodo[]=>[...prevDoneTodos, todo]);
        }
        const deleteTodo = (doneTodo : TTodo): void =>{
            setDoneTodos((prevDoneTodo): TTodo[]=> 
            prevDoneTodo.filter((t): boolean => t.id !== doneTodo.id)
        );
        };
        return (
            <TodoContext.Provider value={{ todos, doneTodos, addTodo, completeTodo, deleteTodo }}>
            {children}
        </TodoContext.Provider>
        );  
    
    };
export default TodoProvider;

export const useTodoContext = (): ITodoContext =>{
    const context = React.useContext(TodoContext);
    if(!context){
        throw new Error('TodoContext not found');
    }
    return context;
};