import React from "react";
import { StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import Navigation from "./components/Navigation/Navigation";
import SafeAreaView from "./components/SafeAreaView";
import {theme as themeFunction, lightTheme as lightFunction} from "./components/theme";
import store from "./store";
import {LightProvider} from "./hooks/useLight";
import SnackbarProvider from "./hooks/useSnackbar/SnackbarProvider";

export default function App(): JSX.Element {
  const [theme, setTheme] = React.useState<unknown>();

  React.useEffect(() => {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor("transparent");
    SplashScreen.preventAutoHideAsync();
    themeFunction().then((t) => {
      setTheme(t);
    });
  }, []);

  return (
    <>
      {theme ? (
        <Provider store={store}>
          <PaperProvider theme={theme}>
            <SnackbarProvider>
              <LightProvider>
                <SafeAreaProvider>
                  <SafeAreaView>
                    <Navigation />
                  </SafeAreaView>
                </SafeAreaProvider>
              </LightProvider>
            </SnackbarProvider>
          </PaperProvider>
        </Provider>
      ) : (
        <StatusBar translucent backgroundColor="transparent" />
      )}
    </>
  );
}
