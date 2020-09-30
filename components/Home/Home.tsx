import * as React from "react";
import { ScrollView } from "react-native";
import { Title, useTheme } from "react-native-paper";
import Card from "../Card/Card";
import { StatusBar } from "react-native";

export interface HomeProps {}

export interface HomeState {}

function Home(props: HomeProps) {
  const theme = useTheme();

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle="light-content"
      />
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <Title>Welcome in the DevLights App</Title>
        <Card
          style={{ width: "80%", height: 120, marginTop: 10 }}
          color={["#f00", "#ff00bb"]}
          ip={"1.1.1.1"}
        ></Card>
        <Card
          style={{ width: "80%", height: 120, marginTop: 10 }}
          color={["#ff0", "#ff00bb"]}
          ip={"1.1.1.1"}
        ></Card>
        <Card
          style={{ width: "80%", height: 120, marginTop: 10 }}
          color={["#00f", "#ff00bb"]}
          ip={"1.1.1.1"}
        ></Card>
      </ScrollView>
    </>
  );
}

export default Home;
