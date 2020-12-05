import axios, { AxiosError, AxiosResponse } from "axios";
import Lottie from "lottie-react-native";
import * as React from "react";
import {
  AsyncStorage,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { ActivityIndicator, Text, Title, useTheme } from "react-native-paper";
import { useSelector, useStore } from "react-redux";
import { Light } from "../../interfaces";
import { Store } from "../../store";
import { SET_ALL_LIGHTS, SET_FAVOURITES } from "../../store/actions/types";
import Card from "../Card";

interface SpinnerProps {
  visible: boolean;
}

export function Spinner(props: SpinnerProps): JSX.Element {
  const styles = StyleSheet.create({
    container: {
      height: "100%",
      width: "100%",
      flexDirection: "row",
      alignSelf: "center",
      justifyContent: "center",
    },
    indicator: {
      alignSelf: "center",
      alignItems: "center",
    },
  });
  const {visible} = props;
  return (
    <>
      {visible ? (
        <View style={styles.container}>
          <ActivityIndicator
            style={styles.indicator}
            size={60}
          />
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
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const fetch = async (refreshing = false) => {
    if (refreshing) setRefresh(refreshing);
    const json : string = await AsyncStorage.getItem("favourites");
    store.dispatch({type: SET_FAVOURITES, favourites: Array.from(JSON.parse(json))});
    setLoading(true);
    setError(false);
    axios
      .get("http://devlight/")
      .then((response: AxiosResponse) => {
        store.dispatch({
          type: SET_ALL_LIGHTS,
          lights: response.data.object,
        });
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
    if (refreshing) setRefresh(false);
  };

  React.useEffect(() => {
    fetch();
  }, []);

  const { colors } = useTheme();
  const styles = StyleSheet.create({
    title: {
      paddingTop: 30,
      marginBottom: 10,
      fontSize: 40,
    },
    contentContainerStyle: { alignItems: "center" },
    error_text: {
      textAlign: "center",
      fontSize: 16,
    },
  });
  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle="light-content"
      />
      <Spinner visible={loading} />
      <ScrollView
        refreshControl={(
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => getLights(true)}
            tintColor={colors.accent}
            colors={[colors.primary, colors.accent]}
          />
        )}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <Title style={styles.title}>Lights</Title>
        {lights.length > 0 && !error ? (
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
    </>
  );
}
