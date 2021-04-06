import React from "react";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import axios from "axios";
import Navigation from "./components/Navigation/Navigation";
import SafeAreaView from "./components/SafeAreaView";
import ThemeProvider from "./components/ThemeDialog/ThemeProvider";
import { LightProvider } from "./hooks/useLight";
import SnackbarProvider from "./hooks/useSnackbar/SnackbarProvider";
import store from "./store";
import "intl";
import "intl/locale-data/jsonp/en";

axios.defaults.baseURL = "http://devlight";
export default function App(): JSX.Element {
  React.useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);
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
