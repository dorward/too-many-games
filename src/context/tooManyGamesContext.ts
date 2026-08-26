import { createContext } from "react";
import type { ContextValue } from "../types";

export const tooManyGamesContext = createContext<ContextValue | null>(null);
