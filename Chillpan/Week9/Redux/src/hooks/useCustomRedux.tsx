import {
  useDispatch as useDefaultDispatch,
  useSelector as useDefaultSelector,
} from "react-redux";
import type { AppDispatch } from "../store/store";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../store/store";

export const useDispatch: () => AppDispatch = useDefaultDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useDefaultSelector;
