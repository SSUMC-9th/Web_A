import './index.css';
import Todo from './components/Todo'
import TodoProvider from './context/TodoContext';
import React from 'react';

const App: React.FC = () =>{


  return (
    <>
    <TodoProvider>
    <Todo/>
    </TodoProvider>
    </>
  )
};

export default App
