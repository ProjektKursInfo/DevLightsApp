import axios, { AxiosResponse } from "axios";
import React from "react";
import { Text } from "react-native";
import { getIpAddressesForHostname } from "react-native-dns-lookup";
import "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { Theme } from "react-native-paper/lib/typescript/src/types";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import Navigation from "./components/Navigation/Navigation";
import SafeAreaView from "./components/SafeAreaView";
import themeFunction from './components/theme';
import store from "./store";


const getIp = async (): Promise<string> => {
  let ips: string[] = [];
  try {
    ips = await getIpAddressesForHostname("devlight") as string[];
  } catch { }
  for (let i = 0; i < ips.length; i++) {
    //regex for ipv4 maybe v6 later as well
    if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ips[i])) {
      try {
        const response: AxiosResponse = await axios.get(`http://${ips[i]}/ping`)
        if (response.status == 200 && response.data == "pong") {
          return ips[i];
        }
      } catch {
      }
    }

  }
  throw new Error("Can't get IP of devlight");
}


export default function App() {
  const [hasIp, setHasIp] = React.useState<boolean>(false);
  const [theme, setTheme] = React.useState<Theme>();
  React.useEffect(() => {
    getIp().then(ip => {
      global.ip = ip;
      setHasIp(true);
    })
    themeFunction().then(theme => {
      setTheme(theme)
    })

  }, [])
  return (
    <>
      {
        hasIp && theme ? <Provider store={store}>
          <PaperProvider theme={theme}>
            <SafeAreaProvider>
              <SafeAreaView>
                <Navigation></Navigation>
              </SafeAreaView>
            </SafeAreaProvider>
          </PaperProvider>
        </Provider> : <Text>This is a splashscreen</Text>
      }
    </>

  );
}
