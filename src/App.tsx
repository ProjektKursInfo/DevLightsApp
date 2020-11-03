import React from "react";
import { Text } from "react-native";
import "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import Navigation from "./components/Navigation/Navigation";
import SafeAreaView from "./components/SafeAreaView";
import themeFunction from "./components/theme";
import store from "./store";

export default function App(): JSX.Element {
  const [theme, setTheme] = React.useState<unknown>();
  React.useEffect(() => {
    themeFunction().then((t) => {
      setTheme(t);
    });
  }, []);
  return (
    <>
      {theme ? (
        <Provider store={store}>
          <PaperProvider theme={theme}>
            <SafeAreaProvider>
              <SafeAreaView>
                <Navigation />
              </SafeAreaView>
            </SafeAreaProvider>
          </PaperProvider>
        </Provider>
      ) : (
        <Text>This is a splashscreen</Text>
      )}
    </>
  );
}
