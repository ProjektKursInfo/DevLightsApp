import {
  TitilliumWeb_300Light,
  TitilliumWeb_400Regular,
  TitilliumWeb_400Regular_Italic,
  TitilliumWeb_600SemiBold,
  TitilliumWeb_700Bold,
  TitilliumWeb_700Bold_Italic
} from "@expo-google-fonts/titillium-web";
import * as Font from "expo-font";
import { configureFonts, DarkTheme, DefaultTheme } from "react-native-paper";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNativePaper {
    interface ThemeColors {
      secondary: string;
      lightText: string;
      success: string;
      grey: string,
      dark_grey: string,
    }
    interface Theme {
      spacing: (value: number) => number;
    }
  }
}

const font : ReactNativePaper.ThemeFonts = {
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
};

const fontConfig = {
  default: font,
  android: font,
  ios: font,
  web: font,
  native: font,
};

const loadFonts = async () => {
  await Font.loadAsync({
    "TitilliumWeb-Regular": TitilliumWeb_400Regular,
    "TitilliumWeb-SemiBold": TitilliumWeb_600SemiBold,
    "TitilliumWeb-Light": TitilliumWeb_300Light,
    "TitilliumWeb-Bold": TitilliumWeb_700Bold,
    "TitilliumWeb-Italic": TitilliumWeb_400Regular_Italic,
    "TitilliumWeb-Bold-Italic": TitilliumWeb_700Bold_Italic,
  });
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const lightTheme = async () => {
  await loadFonts();
  return {
    ...DefaultTheme,
    dark: false,
    spacing(s: number) {
      return 4 * s;
    },
    colors: {
      ...DefaultTheme.colors,
      primary: "#1DE9B6",
      accent: "#FF9800",
      secondary: "#FF7D91",
      text: "#000000",
      background: "#fff",
      surface: "#fff",
      lightText: "#d1d1d1",
      success: "#2dce89",
      grey: "#cfcfcf",
      dark_grey: "#919191",
    },
    fonts: configureFonts(fontConfig),
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const theme = async () => {
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
      lightText: "#d1d1d1aa",
      success: "#2dce89",
      grey: "#4f4f4f",
      dark_grey: "#393939",
      error: "rgb(178, 0, 35)",
    },
    fonts: configureFonts(fontConfig),
  };
};
