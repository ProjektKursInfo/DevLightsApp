import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import * as SplashScreen from "expo-splash-screen";
import Lottie from "lottie-react-native";
import * as React from "react";
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { ActivityIndicator, Text, Title, useTheme } from "react-native-paper";
import { useSelector, useStore } from "react-redux";
import { Light, Response } from "@devlights/types";
import allSettled from "promise.allsettled";
import useNetwork from "../../hooks/useNetwork";
import { Store } from "../../store";
import {
  setFavouriteColors,
  setFavouriteGradients,
} from "../../store/actions/favourites";
import { setAllLights } from "../../store/actions/lights";
import { SET_ALL_LIGHTS, SET_TAGS } from "../../store/types/types";
import LightCard from "../LightCard";
import { useThemeChange } from "../ThemeDialog";
import { ThemeType } from "../../interfaces/types";
import { setTags } from "../../store/actions/tags";

interface SpinnerProps {
  visible: boolean;
}

export function Spinner(props: SpinnerProps): JSX.Element {
  const styles = StyleSheet.create({
    container: {
      height: "75%",
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
    },
    indicator: {
      alignSelf: "center",
      alignItems: "center",
    },
  });
  const { visible } = props;
  return (
    <>
      {visible ? (
        <View style={styles.container}>
          <ActivityIndicator style={styles.indicator} size={60} />
        </View>
      ) : (
        <View />
      )}
    </>
  );
}

function Home(): JSX.Element {
  const theme = useTheme();
  const store = useStore();
  const lights: Light[] = useSelector((state: Store) => state.lights);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);

  const themeChange = useThemeChange();
  const network = useNetwork();

  const fetchTheme = async () => {
    console.log("exeucte");
    const themeType: ThemeType =
      ((await AsyncStorage.getItem("themeType")) as ThemeType) ?? "Dark";
    await themeChange.changeTheme(themeType);
    return theme;
  };

  const fetch = async () => {
    setLoading(true);
    setError(false);
    const fetching = fetchTheme();
    const lightPromise: Promise<AxiosResponse<Response<Light[]>>> = axios.get(
      "http://devlight/lights",
    );
    const tagsPromise = axios.get("http://devlight/tags");
    const promises: Promise<any>[] = [];
    promises.push(fetching);
    if (network) {
      promises.push(lightPromise);
      promises.push(tagsPromise);
    }
    allSettled(promises).then((val) => {
      try {
        if (val[1]) {
          const newLights = val[1].value.data.object;
          store.dispatch(setAllLights(newLights));
        } else {
          setError(true);
        }
        if (val[2]) {
          store.dispatch(setTags(val[2].value.data.object));
        }
      } catch {
        setError(true);
      }
      setLoading(false);
      SplashScreen.hideAsync();
    });

    const favouriteColors: string | null = await AsyncStorage.getItem(
      "favouriteColors",
    );
    const favouriteGradients: string | null = await AsyncStorage.getItem(
      "favouriteGradients",
    );
    if (favouriteColors != null) {
      store.dispatch(
        setFavouriteColors(Array.from(JSON.parse(favouriteColors))),
      );
    }
    if (favouriteGradients != null) {
      store.dispatch(
        setFavouriteGradients(Array.from(JSON.parse(favouriteGradients))),
      );
    }
  };

  React.useEffect(() => {
    if (network) {
      fetch();
    } else {
      setError(true);
    }
  }, [network]);

  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: { width: "100%", height: "100%" },
    title: {
      paddingTop: 30,
      marginBottom: 10,
      fontSize: 40,
    },
    contentContainerStyle: {
      alignItems: "center",
      width: "100%",
      height: "100%",
    },
    error_text: {
      textAlign: "center",
      fontSize: 16,
    },
  });
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle="light-content"
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => fetch(true)}
            tintColor={colors.accent}
            colors={[colors.primary, colors.accent]}
          />
        }
        contentContainerStyle={styles.contentContainerStyle}
      >
        <Title style={styles.title}>Lights</Title>

        <Spinner visible={loading} />

        {lights.length > 0 && !error && !loading ? (
          lights.map((light: Light) => (
            <LightCard key={light.id} light={light} />
          ))
        ) : (
          <>
            {loading ? (
              <Text> </Text>
            ) : (
              <>
                <Lottie
                  duration={4000}
                  autoPlay
                  hardwareAccelerationAndroid
                  loop={false}
                  autoSize
                  // eslint-disable-next-line global-require
                  source={require("../../../assets/animations/bulb.json")}
                />
                <Text style={styles.error_text}>
                  Sorry! We couldn`t find any lights in your Network.
                  {"\n"}
                  Plug some in and they will appear here.
                </Text>
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
export default Home;
