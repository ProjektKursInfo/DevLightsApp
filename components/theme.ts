import { DarkTheme } from "react-native-paper";

const theme = {
  ...DarkTheme,
  dark: true,
  spacing(s: number) {
    return 4 * s;
  },
  colors: {
    ...DarkTheme.colors,
    primary: "#FF9800",
    accent: "#1DE9B6",
    background: "#2f2f2f",
    secondary: "#FF7D91",
    text: "#d1d1d1",
  },
};
export default theme;
