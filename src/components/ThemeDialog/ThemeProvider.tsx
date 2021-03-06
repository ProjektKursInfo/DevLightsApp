import * as React from "react";
import { Appearance } from "react-native";
import { Provider } from "react-native-paper";
import { useDispatch } from "react-redux";
import { Theme } from "../../interfaces/types";
import setTheme from "../../store/actions/theme";
import {
  lightTheme as lightFunction,
  darkTheme as darkFunction,
} from "../theme";

export interface ThemeProviderProps {
  children: JSX.Element;
}

export const ThemeContext = React.createContext<{
  changeTheme(type: Theme): Promise<void>;
}>({ changeTheme: () => new Promise<void>((): void => {}) });

export function useThemeChange(): React.ContextType<typeof ThemeContext> {
  return React.useContext<{ changeTheme(type: Theme): Promise<void> }>(
    ThemeContext,
  );
}

export default function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  const { children } = props;
  const [theme, setStateTheme] = React.useState<ReactNativePaper.Theme>();
  const colorScheme = Appearance.getColorScheme();
  const dispatch = useDispatch();

  const changeTheme = async (type: Theme) => {
    if (
      type === "Dark" ||
      (type === "System-Default" && colorScheme === "dark")
    ) {
      await darkFunction().then((t) => {
        setStateTheme(t);
      });
      dispatch(setTheme(type));
    } else if (
      type === "Light" ||
      (type === "System-Default" && colorScheme === "light")
    ) {
      await lightFunction().then((t) => {
        setStateTheme(t);
      });
      dispatch(setTheme(type));
    }
  };

  return (
    <ThemeContext.Provider value={{ changeTheme }}>
      <Provider theme={theme}>{children}</Provider>
    </ThemeContext.Provider>
  );
}
