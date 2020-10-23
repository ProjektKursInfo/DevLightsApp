import "react-native-gesture-handler";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./components/Navigation/Navigation";
import SafeAreaView from "./components/SafeAreaView";
import { Provider as PaperProvider } from "react-native-paper";
import theme from "./components/theme";
import { getIpAddressesForHostname } from "react-native-dns-lookup";

async function getIp() {
  let ip = "";

  await getIpAddressesForHostname("TimoLaptop").then((res) => {
    /* console.log(res[0]); */
    ip = res[0];
  });

  global.ip = ip;
}

export default function App() {
  getIp();

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
