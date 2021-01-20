import React from "react";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import Navigation from "./components/Navigation/Navigation";
import SafeAreaView from "./components/SafeAreaView";
import ThemeProvider from "./components/ThemeDialog/ThemeProvider";
import { LightProvider } from "./hooks/useLight";
import SnackbarProvider from "./hooks/useSnackbar/SnackbarProvider";
import store from "./store";

export default function App(): JSX.Element {
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
