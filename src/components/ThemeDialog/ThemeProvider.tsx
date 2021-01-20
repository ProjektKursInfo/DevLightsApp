import * as React from "react";
import { Appearance, StatusBar } from "react-native";
import { Provider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme as themeFunction, lightTheme as lightFunction } from "../theme";
import { ThemeType } from "../../interfaces/types";

export interface ThemeProviderProps {
  children: JSX.Element;
}

export const ThemeContext = React.createContext<{
  changeTheme(type: ThemeType): Promise<void>;
}>(undefined);

export function useThemeChange() : React.ContextType<typeof ThemeContext> {
  return React.useContext<{changeTheme(type: ThemeType): Promise<void>}>(ThemeContext);
}

export default function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  const { children } = props;
  const [theme, setTheme] = React.useState<ReactNativePaper.Theme>();
  const colorScheme = Appearance.getColorScheme();
  React.useEffect(() => {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor("transparent");
    SplashScreen.preventAutoHideAsync();
    async function getTheme() {
      const themeType: ThemeType =
        ((await AsyncStorage.getItem("theme")) as ThemeType) ?? "dark";
      if (
        themeType === "dark" ||
        (themeType === "system-default" && colorScheme === "dark")
      ) {
        themeFunction().then((t) => {
          setTheme(t);
        });
      } else if (
        themeType === "light" ||
        (themeType === "system-default" && colorScheme === "light")
      ) {
        lightFunction().then((t) => {
          setTheme(t);
        });
      }
    }
    getTheme();
  }, []);

  const changeTheme = async (type: ThemeType) => {
    if (
      type === "dark" || (type === "system-default" && colorScheme === "dark")
    ) {
      themeFunction().then((t) => {
        setTheme(t);
      });
      await AsyncStorage.setItem("theme", type);
    } else if (
      type === "light" || (type === "system-default" && colorScheme === "light")
    ) {
      lightFunction().then((t) => {
        setTheme(t);
      });
      await AsyncStorage.setItem("theme", type);
    }
  };

  return (
    <ThemeContext.Provider value={{ changeTheme }}>
      <Provider theme={theme}>{children}</Provider>
    </ThemeContext.Provider>
  );
}
