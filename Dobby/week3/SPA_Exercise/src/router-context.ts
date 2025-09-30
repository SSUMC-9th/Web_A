// src/router-context.ts
import { createContext } from "react";

export type RouterState = {
  path: string;
  pathname: string;
  params: Record<string, string>;
};

export const RouterContext = createContext<RouterState>({
  path: "/",
  pathname: "/",
  params: {},
});
