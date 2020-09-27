import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./components/Navigation/Navigation";
import SafeAreaView from "./components/SafeAreaView";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Navigation></Navigation>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
