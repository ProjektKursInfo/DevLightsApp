import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { RefreshControl, ScrollView, StatusBar } from "react-native";
import { Title, useTheme } from "react-native-paper";
import { Light } from "../../interfaces";
import Card from "../Card/Card";

export interface HomeProps {}

export default function Home(props: HomeProps) {
  const theme = useTheme();

  const [lights, setLights] = React.useState<Light[]>([]);
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
        console.log(response.data[0]);
        setLights(response.data);
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
        {
          /* lights.length > 0 ? */ lights.map((light) => {
            return (
              <Card
                pattern={light.leds.pattern}
                key={light.uuid}
                id={light.uuid}
                name={light.name}
                colors={light.leds.colors}
                count={light.count}
              ></Card>
            );
          }) /* : (
          <Text> There aren't any lights in your network</Text>
        ) */
        }
      </ScrollView>
    </>
  );
}
/* 
export default Home; */
