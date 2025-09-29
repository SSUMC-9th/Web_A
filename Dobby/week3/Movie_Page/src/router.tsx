// src/router.tsx
import { useEffect, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { routes, fallback } from "./routes";
import { NAV_EVENT } from "./history";
import { RouterContext, type RouterState } from "./router-context";

function getMatch(pathname: string): { element: ReactElement; params: Record<string, string> } {
  for (const r of routes) {
    const m = r.pattern.exec({ pathname });
    if (m) return { element: r.element, params: m.pathname.groups ?? {} };
  }
  return { element: fallback, params: {} };
}

type ProviderProps = {
  /** App.tsx에서 <RouterProvider render={(el) => el} />로 사용 */
  render: (element: ReactElement) => ReactNode;
};

export function RouterProvider({ render }: ProviderProps) {
  const [path, setPath] = useState(() => location.pathname + location.search + location.hash);

  useEffect(() => {
    const onPop = () => {
      setPath(location.pathname + location.search + location.hash);
      const y: number = history.state?.__scrollY ?? 0;
      requestAnimationFrame(() => window.scrollTo(0, y));
    };
    const onNav = () => setPath(location.pathname + location.search + location.hash);

    addEventListener("popstate", onPop);
    addEventListener(NAV_EVENT, onNav);
    return () => {
      removeEventListener("popstate", onPop);
      removeEventListener(NAV_EVENT, onNav);
    };
  }, []);

  const match = getMatch(location.pathname);

  const value: RouterState = {
    path,
    params: match.params,
    pathname: location.pathname,
  };

  return <RouterContext.Provider value={value}>{render(match.element)}</RouterContext.Provider>;
}
