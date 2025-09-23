import Menu from './Menu';
import React, { type FormEvent, useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
// import { useState } from 'react'; 

const ThemeForm: React.FC<{ count: number }> = ({ count }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [input, setInput] = useState(isDarkMode ? '다크 모드' : '라이트 모드');

  const handleChange = (e: FormEvent<HTMLFormElement>):void => {
    e.preventDefault();
    if(isDarkMode){
      e.preventDefault();
       toggleDarkMode();
    } 
  };
  return (
    <form className= 'darkmode-form' onSubmit={(e): void => handleChange(e)}>
    <input
      value={input}
      type="text"
      id='theme-input'
      onChange={(e): void => {setInput((e.target as HTMLInputElement).value)}}
      />
      <Menu count={count} />
    </form>
  );
};
export default ThemeForm;