import { ThemeType } from "../../interfaces/types";
import { SetThemeAction } from "../types/theme";

export default function setTheme(theme: ThemeType): SetThemeAction {
  return { type: "SET_THEME", theme };
}
