import axios, { AxiosResponse } from "axios";
import Lottie from "lottie-react-native";
import * as React from "react";
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet
} from "react-native";
import { Text, Title, useTheme } from "react-native-paper";
import { useSelector, useStore } from "react-redux";
import { Light } from "../../interfaces";
import { Store } from "../../store";
import { SET_ALL_LIGHTS } from "../../store/actions/types";
import Card from "../Card";

export default function Home(): JSX.Element {
  const theme = useTheme();
  const store = useStore();
  const lights: Light[] = useSelector((state: Store) => state.lights);
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const getLights = (refreshing = false): void => {
    if (refreshing) setRefresh(refreshing);
    setError(false);
    axios
      .get("http://devlight/settings")
      .then((response: AxiosResponse) => {
        console.log(response);
        store.dispatch({
          type: SET_ALL_LIGHTS,
          lights: response.data.object,
        });
      })
      .catch((err) => {
        console.log(err.toJson());
        setError(true);
      });
    if (refreshing) setRefresh(false);
  };

  React.useEffect(() => {
    getLights();
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
  console.log("home render");
  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle="light-content"
      />

      <ScrollView
        refreshControl={
          (
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => getLights(true)}
              tintColor={colors.accent}
              colors={[colors.primary, colors.accent]}
            />
          )
        }
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
              Sorry! We couldn't find any lights in your Network.
              {"\n"}
              Plug some in and they will appear here.
            </Text>
          </>
        )}
      </ScrollView>
    </>
  );
}
