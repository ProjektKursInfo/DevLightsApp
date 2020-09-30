import * as React from "react";
import { ScrollView } from "react-native";
import { Title, useTheme } from "react-native-paper";
import Card from "../Card/Card";
import { StatusBar } from "react-native";

export interface HomeProps {}

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
        <Card colors={["#ff0"]} ip={"1.1.1.1"}></Card>
        <Card setup colors={["#fb6340", "#fbb140"]} ip={"1.1.1.1"}></Card>
        <Card colors={["#00f", "#ff00bb"]} ip={"1.1.1.1"}></Card>
      </ScrollView>
    </>
  );
}

export default Home;
