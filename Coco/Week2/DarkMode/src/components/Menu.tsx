import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';

const Menu: React.FC<{ count: number }> = ({ count }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <div className='menu'>
      <h3 className="munu-text">Menu</h3>
      <p>Count: {count}</p>
      <p>현재 테마: {isDarkMode ? '다크 모드' : '라이트 모드'}</p>
    </div>
  );
};
export default Menu;