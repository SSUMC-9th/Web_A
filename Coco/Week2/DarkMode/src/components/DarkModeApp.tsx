import React from "react";
import { useDarkMode } from "../context/DarkModeContext";  


const DarkModeApp: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className={`darkmode-app ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="darkmode-container">
      
        <h1 className='darkmode-container__title'>
          {isDarkMode ? '🌙' : '☀️'} {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </h1>
      
        <p className='darkmode-container__description'>
          모드를 전환하세요.
        </p>
      
        <button
          onClick={toggleDarkMode}
          className='darkmode-container__toggle'
        >
          <div className='darkmode-container__toggle-button'>
          </div>
        </button>
        
        <div className='darkmode-status'>
          <span className='darkmode-status__text'>
            현재 모드: {isDarkMode ? '다크 모드' : '라이트 모드'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DarkModeApp;
