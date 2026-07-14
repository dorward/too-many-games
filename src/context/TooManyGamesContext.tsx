import { createContext } from "react";
import type { ContextValue } from "../types";

export const TooManyGamesContext = createContext<ContextValue | null>(null);
