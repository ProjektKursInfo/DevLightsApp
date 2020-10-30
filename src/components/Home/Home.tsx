import axios, { AxiosResponse } from "axios";
import Lottie from "lottie-react-native";
import * as React from "react";
import { RefreshControl, ScrollView, StatusBar, StyleSheet } from "react-native";
import { Text, Title, useTheme } from "react-native-paper";
import { useSelector, useStore } from "react-redux";
import { Light } from "../../interfaces";
import { Store } from "../../store";
import Card from "../Card";
export interface HomeProps { }

export default function Home(props: HomeProps): JSX.Element {
  const theme = useTheme();
  const store = useStore();
  const lights: Light[] = useSelector((state: Store) => state.lights)
  const [refresh, setRefresh] = React.useState<boolean>(false);


  React.useEffect(() => {/* 
    console.log("effect"); */
    getLights();
  }, []);
  const getLights = (refreshing: boolean = false): void => {
    if (refreshing) setRefresh(refreshing);
    axios
      .get(`http://${ip}/settings`)
      .then((response: AxiosResponse) => {
        store.dispatch({
          type: "SET_ALL_LIGHTS",
          lights: response.data.object,
        });
      })
      .catch((err: unknown) => {
      });
    if (refreshing) setRefresh(false);
  };
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    title: {
      paddingTop: 30,
      marginBottom: 10,
      fontSize: 40
    }
  })
  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle="light-content"
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => getLights(true)}
            tintColor={colors.accent}
            colors={[colors.primary, colors.accent]}
          />
        }
        contentContainerStyle={{ alignItems: "center" }}
      >
        <Title style={styles.title}>Lights</Title>
        {lights.length > 0 ? (
          lights.map((light: Light) => {
            return <Card key={light.uuid} light={light}></Card>;
          })
        ) : (
            <>
              <Lottie duration={4000} autoPlay hardwareAccelerationAndroid loop={false} autoSize source={require("../../../assets/animations/bulb.json")}></Lottie>
              <Text style={{ textAlign: "center", fontSize: 16 }}> Sorry! We couldn't find any lights in your Network. {"\n"} Plug some in and they will appear here.</Text>
            </>
          )}
      </ScrollView>
    </>
  );
}
