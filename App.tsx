import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./components/Navigation/Navigation";
import SafeAreaView from "./components/SafeAreaView";
import { Provider as PaperProvider } from "react-native-paper";
import theme from "./components/theme";

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView>
          <Navigation></Navigation>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
