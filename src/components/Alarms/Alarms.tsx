import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Title } from "react-native-paper";
import AlarmCard from "../AlarmCard/AlarmCard";

export default function Alarms(): JSX.Element {
  const styles = StyleSheet.create({
    contentContainerStyle: {
      alignItems: "center",
    },
    title: {
      paddingTop: 30,
      marginBottom: 10,
      fontSize: 40,
    },
  });
  return (
    <ScrollView contentContainerStyle={styles.contentContainerStyle}>
      <Title style={styles.title}>Alarms</Title>
      <AlarmCard alarm={{
        color: "#ff00ff",
        days: [0, 1, 2],
        esps: ["1.1"],
        repeat: 3,
        date: "2021-03-05T12:51:40Z",
      }} 
      />
    </ScrollView>
  );
}
