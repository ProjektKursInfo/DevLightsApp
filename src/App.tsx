import React from "react";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import axios from "axios";
import { StyleSheet, View } from "react-native";
import Navigation from "./components/Navigation/Navigation";
import SafeAreaView from "./components/SafeAreaView";
import ThemeProvider from "./components/ThemeDialog/ThemeProvider";
import SnackbarProvider from "./hooks/useSnackbar/SnackbarProvider";
import store from "./store";
import "intl";
import "intl/locale-data/jsonp/en";

axios.defaults.baseURL = "http://devlight";
export default function App(): JSX.Element {
  React.useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);
  const styles = StyleSheet.create({
    root: { backgroundColor: "#000", height: "100%", width: "100%" },
  });
  return (
    <View style={styles.root}>
      <Provider store={store}>
        <SafeAreaProvider>
          <ThemeProvider>
            <SnackbarProvider>
              <SafeAreaView>
                <Navigation />
              </SafeAreaView>
            </SnackbarProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </Provider>
    </View>
  );
}
