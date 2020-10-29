import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { RefreshControl, ScrollView, StatusBar, Text } from "react-native";
import { Title, useTheme } from "react-native-paper";
import { useStore } from "react-redux";
import { Light } from "../../interfaces";
import Card from "../Card";

export interface HomeProps {}

export default function Home(props: HomeProps) {
  const theme = useTheme();
  const store = useStore();

  const lights: Light[] = store.getState().lights;
  const [refresh, setRefresh] = React.useState<boolean>(false);

  React.useEffect(() => {
    console.log("effect");
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
        /* props.setAllLights(response.data.object); */
      })
      .catch((err: unknown) => {
        console.log(err);
      });
    if (refreshing) setRefresh(false);
  };
  const { colors } = useTheme();
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
        <Title>Welcome in the DevLights App</Title>
        {lights.length > 0 ? (
          lights.map((light: Light) => {
            return <Card key={light.uuid} light={light}></Card>;
          })
        ) : (
          <Text> There are no lights in your network</Text>
        )}
      </ScrollView>
    </>
  );
}
