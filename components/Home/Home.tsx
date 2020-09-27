import * as React from "react";
import { ScrollView } from "react-native";
import { Title } from "react-native-paper";
import Card from "../Card/Card";

export interface HomeProps {}

export interface HomeState {}

class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
  }
  render() {
    return (
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <Title>Welcome in the DevLights App</Title>
        <Card
          style={{ width: "80%", height: 120, marginTop: 10 }}
          color={"#f00"}
          ip={"1.1.1.1"}
        ></Card>
        <Card
          style={{ width: "80%", height: 120, marginTop: 10 }}
          color={"#ff0"}
          ip={"1.1.1.1"}
        ></Card>
        <Card
          style={{ width: "80%", height: 120, marginTop: 10 }}
          color={"#f0f"}
          ip={"1.1.1.1"}
        ></Card>
      </ScrollView>
    );
  }
}

export default Home;
