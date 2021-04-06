import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import * as SplashScreen from "expo-splash-screen";
import Lottie from "lottie-react-native";
import * as React from "react";
import {
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { ActivityIndicator, Text, Title, useTheme } from "react-native-paper";
import { useSelector, useStore } from "react-redux";
import { Alarm, Light, Response } from "@devlights/types";
import allSettled from "promise.allsettled";
import useNetwork from "../../hooks/useNetwork";
import { Store } from "../../store";
import {
  setFavouriteColors,
  setFavouriteGradients,
} from "../../store/actions/favourites";
import { setAllLights } from "../../store/actions/lights";
import LightCard from "../LightCard";
import { useThemeChange } from "../ThemeDialog";
import { ThemeType } from "../../interfaces/types";
import { setTags } from "../../store/actions/tags";
import { LightResponse } from "../../hooks/useLight/LightProvider";
import { setAlarms } from "../../store/actions/alarms";

interface SpinnerProps {
  visible: boolean;
}

type AxiosPromise<T> = Promise<AxiosResponse<Response<T>>>;

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

export default function Home(): JSX.Element {
  const theme = useTheme();
  const store = useStore();
  const lights: Light[] = useSelector((state: Store) => state.lights);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);

  const themeChange = useThemeChange();
  const network = useNetwork();

  const fetchTheme = async () => {
    const themeType: ThemeType =
      ((await AsyncStorage.getItem("theme")) as ThemeType) ?? "Dark";
    await themeChange.changeTheme(themeType);
    return theme;
  };

  const fetch = async () => {
    setLoading(true);
    setError(false);
    const fetching = fetchTheme();

    const lightPromise: AxiosPromise<Light[]> = axios.get("/lights");
    const alarmPromise: AxiosPromise<Alarm[]> = axios.get("/alarm");
    const tagsPromise: AxiosPromise<string[]> = axios.get("/tags");
    const promises: Promise<AxiosResponse<LightResponse> | unknown>[] = [];
    promises.push(fetching);
    if (network) {
      promises.push(lightPromise);
      promises.push(tagsPromise);
      promises.push(alarmPromise);
    }
    allSettled(promises).then((val) => {
      try {
        if (val[1]) {
          console.log(val[1].value);
          const newLights = val[1].value.data.object;
          store.dispatch(setAllLights(newLights));
        } else {
          store.dispatch(setAllLights([]));
          setError(true);
        }
        if (val[2]) {
          store.dispatch(setTags(val[2].value.data.object));
        } else {
          store.dispatch(setTags([]));
        }
        if (val[3]) {
          store.dispatch(setAlarms(val[3].value.data.object));
        } else {
          store.dispatch(setAlarms([]));
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
      height: loading
        ? "100%"
        : Dimensions.get("window").height * 0.2 + lights.length * 140,
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
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => fetch()}
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
