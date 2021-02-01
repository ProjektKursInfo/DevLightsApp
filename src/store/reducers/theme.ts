import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeType } from "../../interfaces/types";
import defaultstate from "../defaultstate";
import { SetThemeAction } from "../types/theme";

function themeReducer(
  state = defaultstate.theme,
  action: SetThemeAction,
): ThemeType {
  let theme: ThemeType;
  switch (action.type) {
    case "SET_THEME":
      theme = action.theme;
      AsyncStorage.setItem("theme", theme);
      return theme;
    default:
      return state as ThemeType;
  }
}
export default themeReducer;
