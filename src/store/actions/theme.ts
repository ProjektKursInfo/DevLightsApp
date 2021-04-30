import { Theme } from "../../interfaces/types";
import { SetThemeAction } from "../types/theme";

export default function setTheme(theme: Theme): SetThemeAction {
  return { type: "SET_THEME", theme };
}
