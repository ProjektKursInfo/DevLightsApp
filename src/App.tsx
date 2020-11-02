import axios, { AxiosResponse } from "axios";
import React from "react";
import { Text } from "react-native";
import { getIpAddressesForHostname } from "react-native-dns-lookup";
import "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import Navigation from "./components/Navigation/Navigation";
import SafeAreaView from "./components/SafeAreaView";
import themeFunction from "./components/theme";
import store from "./store";

declare global {
  let ip : string;
}

const getIp = async (): Promise<string> => {
  let ips: string[] = [];
  try {
    ips = (await getIpAddressesForHostname("devlight")) as string[];
  } catch {}
  for (let i = 0; i < ips.length; i++) {
    // regex for ipv4 maybe v6 later as well
    if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ips[i])) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const res: AxiosResponse = await axios.get(`http://${ips[i]}/ping`);
        if (res.status === 200 && res.data === "pong") {
          return ips[i];
        }
      } catch {}
    }
  }
  return "192.168.178.38";
  throw new Error("Can't get IP of devlight");
};

export default function App() : JSX.Element {
  const [hasIp, setHasIp] = React.useState<boolean>(false);
  const [theme, setTheme] = React.useState<unknown>();
  React.useEffect(() => {
    getIp().then((res) => {
      ip = res;
      setHasIp(true);
    });
    themeFunction().then((t) => {
      setTheme(t);
    });
  }, []);
  return (
    <>
      {hasIp && theme ? (
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
