import React from "react";
import { getIpAddressesForHostname } from "react-native-dns-lookup";
import "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import Navigation from "./components/Navigation/Navigation";
import SafeAreaView from "./components/SafeAreaView";
import theme from "./components/theme";
import store from "./store";

async function getIp() {
  let ip = "";

  await getIpAddressesForHostname("devlight").then((res) => {
    /* console.log(res[0]); */
    ip = res[0];
  });

  global.ip = ip;
}

export default function App() {
  getIp();

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <SafeAreaView>
            <Navigation></Navigation>
          </SafeAreaView>
        </SafeAreaProvider>
      </PaperProvider>
    </Provider>
  );
}
