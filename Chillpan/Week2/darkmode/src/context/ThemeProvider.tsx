import { createContext, useContext, useState } from "react";
import type { PropsWithChildren } from "react";

export const THEME = {
  LIGHT: "LIGHT",
  DARK: "DARK",
} as const;

type TTheme = (typeof THEME)[keyof typeof THEME];

interface IThemeContext {
  theme: TTheme; // 지금 테마
  toggleTheme: () => void; // 테마를 전환 함수
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

// 테마 상태를 관리 && 자식 컴포넌트들에게 제공
export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

  const toggleTheme = (): void => {
    setTheme((prevTheme) =>
      prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
    );
  };

  // Context Provider 자식에게 모드 정보 제공
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = (): IThemeContext => {
  const context = useContext(ThemeContext);

  if (!context) {
    //영상에서 나온 오류 처리?
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
