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
import { Light } from "@devlights/types";
import useNetwork from "../../hooks/useNetwork";
import { Store } from "../../store";
import {
  setFavouriteColors,
  setFavouriteGradients,
} from "../../store/actions/favourites";
import { setAllLights } from "../../store/actions/lights";
import { SET_TAGS } from "../../store/types/types";
import LightCard from "../LightCard";

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
  const fetch = async (refreshing = false) => {
    setLoading(true);
    if (refreshing) setRefresh(refreshing);
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
    setError(false);
    axios.get("http://devlight/tags").then((res) => {
      store.dispatch({ type: SET_TAGS, tags: res.data.object });
    });
    axios
      .get("http://devlight/lights", {timeout: 2000})
      .then((response: AxiosResponse) => {
        store.dispatch(setAllLights(response.data.object));
        setLoading(false);
        SplashScreen.hideAsync();
      })
      .catch(() => {
        setLoading(false);
        setError(true);
        SplashScreen.hideAsync();
      });
    if (refreshing) setRefresh(false);
  };
  const network = useNetwork();
  React.useEffect(() => {
    if (network) {
      fetch();
    } else {
      setError(true);
      SplashScreen.hideAsync();
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
        refreshControl={(
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => fetch(true)}
            tintColor={colors.accent}
            colors={[colors.primary, colors.accent]}
          />
        )}
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
