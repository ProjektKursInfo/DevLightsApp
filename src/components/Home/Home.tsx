import axios, { AxiosResponse } from "axios";
import Lottie from "lottie-react-native";
import * as React from "react";
import {
  AsyncStorage,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import { ActivityIndicator, Text, Title, useTheme } from "react-native-paper";
import { useSelector, useStore } from "react-redux";
import { Light } from "../../interfaces";
import { Store } from "../../store";
import { SET_ALL_LIGHTS, SET_FAVOURITES } from "../../store/actions/types";
import Card from "../Card";
import useNetwork from "../../hooks/useNetwork";

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
    const json: string = await AsyncStorage.getItem("favourites");
    if (json != null) {
      store.dispatch({
        type: SET_FAVOURITES,
        favourites: Array.from(JSON.parse(json)),
      });
    }
    setError(false);
    axios
      .get("http://devlight/", {})
      .then((response: AxiosResponse) => {
        store.dispatch({
          type: SET_ALL_LIGHTS,
          lights: response.data.object,
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
    if (refreshing) setRefresh(false);
  };
  const network = useNetwork();

  React.useEffect(() => {
    console.log(network);
    if (network) fetch();
    else setError(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  const { colors } = useTheme();
  const styles = StyleSheet.create({
    title: {
      paddingTop: 30,
      marginBottom: 10,
      fontSize: 40,
    },
    contentContainerStyle: { alignItems: "center", width: "100%", height: "100%" },
    error_text: {
      textAlign: "center",
      fontSize: 16,
    },
  });
  return (
    <View style={{width: "100%", height: "100%"}}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle="light-content"
      />

      <ScrollView
        refreshControl={
          // eslint-disable-next-line react/jsx-wrap-multilines
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

        {loading ? (
          <Spinner visible={true} />
        ) : lights.length > 0 && !error ? (
          lights.map((light: Light) => <Card key={light.uuid} light={light} />)
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
      </ScrollView>
    </View>
  );
}
export default Home;
