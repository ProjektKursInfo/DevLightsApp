import { TitilliumWeb_300Light, TitilliumWeb_400Regular, TitilliumWeb_400Regular_Italic, TitilliumWeb_600SemiBold, TitilliumWeb_700Bold, TitilliumWeb_700Bold_Italic } from "@expo-google-fonts/titillium-web";
import * as Font from 'expo-font';
import { configureFonts, DarkTheme } from "react-native-paper";

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      secondary: string;
      lightText: string;
    }
    interface Theme {
      spacing: Function;
    }
  }
}
const fontConfig = {
  default: {
    regular: {
      fontFamily: "TitilliumWeb-Regular",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "TitilliumWeb-SemiBold",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "TitilliumWeb-Light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "TitilliumWeb-Light",
      fontWeight: "normal",
    },
    bold: {
      fontFamily: "TitilliumWeb-Bold",
      fontWeight: "600"
    }
  }
}

const loadFonts = async () => {
  await Font.loadAsync({
    "TitilliumWeb-Regular": TitilliumWeb_400Regular,
    "TitilliumWeb-SemiBold": TitilliumWeb_600SemiBold,
    "TitilliumWeb-Light": TitilliumWeb_300Light,
    "TitilliumWeb-Bold": TitilliumWeb_700Bold,
    "TitilliumWeb-Italic": TitilliumWeb_400Regular_Italic,
    "TitilliumWeb-Bold-Italic": TitilliumWeb_700Bold_Italic
  });
};



const theme = async () => {
  await loadFonts();
  return {
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
      lightText: "#d1d1d1aa"
    },
    fonts: configureFonts(fontConfig)

  }
}
export default theme;
