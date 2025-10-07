// import './App.css';
import { useTheme } from './context/ThemeProvider';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen items-center justify-center bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">
          {theme === 'light' ? '라이트 모드' : '다크 모드'}
        </h1>
        <button
          onClick={toggleTheme}
          className="px-6 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:opacity-80 transition"
        >
          모드 전환
        </button>
      </div>
    </div>
  );
}
