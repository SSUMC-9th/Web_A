// App.tsx

import "./App.css";
import { useContext } from "react";
import { ThemeProvider, ThemeContext } from "./context/ThemeProvider";
import { THEME } from "./constants/theme";

function App() {
  const context = useContext(ThemeContext);

  if (!context) {
    // 최초 실행 시
    return (
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
  }

  // 구조분해할당 사용해보았다.
  const { theme, toggleTheme } = context;

  // 화면 전체 차지하면서, 색상 전환 효과 제공하는 tailwind 클래스임
  const containerClass = "min-h-screen w-full transition-colors";

  let titleText;
  let buttonText;

  if (theme === THEME.DARK) {
    titleText = "다크 모드 입니다. ";
    buttonText = "라이트 모드로 변경";
  } else {
    titleText = "라이트 모드 입니다.";
    buttonText = "다크 모드로 전환";
  }

  const isDark = theme === THEME.DARK;
  const containerMode = isDark ? "dark" : "light";
  const buttonMode = isDark ? "dark" : "light";

  return (
    <div className={containerClass + " " + containerMode}>
      <div className="center-container">
        <div className="text-center">
          <h1 className="title">{titleText}</h1>

          <div>
            <button onClick={toggleTheme} className={`button ${buttonMode}`}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
