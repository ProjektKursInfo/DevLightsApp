import { Alarm } from "@devlights/types";
import axios, { AxiosResponse } from "axios";
import React from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { Title, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../../store";
import { setAlarms } from "../../store/actions/alarms";
import AlarmCard from "../AlarmCard/AlarmCard";

export default function Alarms(): JSX.Element {
  const alarms = useSelector((state: Store) => state.alarms);
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
  const dispatch = useDispatch();
  const fetchAlarms = () => {
    axios.get("http://devlight/alarm").then((res: AxiosResponse) => {
      dispatch(setAlarms(res.data.object));
      console.log(res.data.object[0]);
    });
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={fetchAlarms} />
      }
      contentContainerStyle={styles.contentContainerStyle}
    >
      <Title style={styles.title}>Alarms</Title>
      {alarms.length !== 0 ? alarms.map((alarm: Alarm) => (
        <AlarmCard key={alarm.date} alarm={alarm} />
      )) : <Text>There arent any Alarms set yet</Text>}
    </ScrollView>
  );
}
