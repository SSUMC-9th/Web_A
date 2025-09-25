export const THEME = {
  LIGHT: "LIGHT",
  DARK: "DARK",
} as const;

export type TTheme = (typeof THEME)[keyof typeof THEME];
