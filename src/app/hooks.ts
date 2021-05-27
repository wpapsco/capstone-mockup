import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

// Use this instead of plain 'useDispatch' and 'useSelector'
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const appSelector: TypedUseSelectorHook<RootState> = useSelector;