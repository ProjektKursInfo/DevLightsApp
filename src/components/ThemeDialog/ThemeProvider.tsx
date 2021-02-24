import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { Appearance, StatusBar } from "react-native";
import { Provider } from "react-native-paper";
import { useDispatch } from "react-redux";
import { ThemeType } from "../../interfaces/types";
import { lightTheme as lightFunction, theme as themeFunction } from "../theme";
import setTheme from "../../store/actions/theme";

export interface ThemeProviderProps {
  children: JSX.Element;
}

export const ThemeContext = React.createContext<{
  changeTheme(type: ThemeType): Promise<void>;
}>({changeTheme: () => new Promise<void>(() : void => {}) });

export function useThemeChange(): React.ContextType<typeof ThemeContext> {
  return React.useContext<{ changeTheme(type: ThemeType): Promise<void> }>(ThemeContext);
}

export default function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  const { children } = props;
  const [theme, setStateTheme] = React.useState<ReactNativePaper.Theme>();
  const colorScheme = Appearance.getColorScheme();
  const dispatch = useDispatch();

  const changeTheme = async (type: ThemeType) => {
    if (
      type === "Dark" || (type === "System-Default" && colorScheme === "dark")
    ) {
      await themeFunction().then((t) => {
        setStateTheme(t);
      });
      dispatch(setTheme(type));
    } else if (
      type === "Light" || (type === "System-Default" && colorScheme === "light")
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
