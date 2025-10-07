import './index.css';
import { useTheme } from './context/ThemeProvider';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1>{theme === 'light' ? '라이트 모드' : '다크 모드'}</h1>
      <button className="button" onClick={toggleTheme}>
        모드 전환
      </button>
    </div>
  );
}
