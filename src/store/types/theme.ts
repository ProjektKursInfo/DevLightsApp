import { Theme } from "../../interfaces/types";
import { SET_THEME } from "./types";

export interface SetThemeAction {
  type: typeof SET_THEME;
  theme: Theme;
}
