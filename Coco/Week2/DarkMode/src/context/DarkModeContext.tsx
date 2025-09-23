import React, { createContext, useState } from 'react';


interface IDarkModeContext{
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<IDarkModeContext | undefined>(undefined);



const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = (): IDarkModeContext => { 
  const context = React.useContext(DarkModeContext);
  if (!context) {
    throw new Error('DarkModeContext not found');
  }
  return context;
};

export default DarkModeProvider;
