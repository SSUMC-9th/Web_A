// src/useRouter.ts
import { useContext } from "react";
import { RouterContext } from "./router-context";

export function useRouter() {
  return useContext(RouterContext);
}

export function useSearchParams() {
  const { path } = useRouter();
  return new URLSearchParams(new URL(path, location.origin).search);
}
