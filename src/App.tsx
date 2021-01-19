import React from "react";
import { StatusBar, Appearance } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navigation from "./components/Navigation/Navigation";
import SafeAreaView from "./components/SafeAreaView";
import store from "./store";
import {LightProvider} from "./hooks/useLight";
import SnackbarProvider from "./hooks/useSnackbar/SnackbarProvider";
import { ThemeType } from "./interfaces/types";
import ThemeProvider from "./components/ThemeDialog/ThemeProvider";

export default function App(): JSX.Element {
  const [theme, setTheme] = React.useState<ReactNativePaper.Theme>();
  const colorScheme = Appearance.getColorScheme();
  console.log(colorScheme);
  return (
    <>
        <Provider store={store}>
          <ThemeProvider>
            <SnackbarProvider>
              <LightProvider>
                <SafeAreaProvider>
                  <SafeAreaView>
                    <Navigation />
                  </SafeAreaView>
                </SafeAreaProvider>
              </LightProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </Provider>
    </>
  );
}
