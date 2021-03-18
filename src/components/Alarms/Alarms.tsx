import { Alarm } from "@devlights/types";
import axios, { AxiosResponse } from "axios";
import { find, isEqual, map } from "lodash";
import React from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import { Title, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Store } from "../../store";
import { setAlarms } from "../../store/actions/alarms";
import AlarmCard from "../AlarmCard/AlarmCard";

export default function Alarms(): JSX.Element {
  const alarms: Alarm[] = useSelector(
    (state: Store) => state.alarms,
    (l: Alarm[], r: Alarm[]) => isEqual(l, r),
  ) || [];
  const [activeSections, setActiveSections] = React.useState<number[]>([]);
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing(2),
    },
    contentContainerStyle: {
      alignItems: "center",
    },
    title: {
      paddingTop: 30,
      marginBottom: 10,
      fontSize: 40,
    },
    headerText: {
      fontSize: 30,
      marginLeft: theme.spacing(5),
      paddingVertical: theme.spacing(2),
    },
  });

  const Header = (props: { id: string }) => (
    <Text
      style={styles.headerText}
    >
      {moment(find(alarms, { id: props.id })?.date)
        .locale("de")
        .format("HH:mm")}
    </Text>
  );
  const dispatch = useDispatch();
  const fetchAlarms = () => {
    axios.get("http://devlight/alarm").then((res: AxiosResponse) => {
      dispatch(setAlarms(res.data.object));
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

      <Accordion
        containerStyle={styles.container}
        sectionContainerStyle={{
          width: Dimensions.get("window").width,
          marginLeft: theme.spacing(2),
        }}
        underlayColor="rgba(255,255,255,0.3)"
        onChange={(indexes: number[]) => setActiveSections(indexes)}
        activeSections={activeSections}
        renderHeader={(content: string) => <Header id={content} />}
        renderContent={(content: string) => (
          <AlarmCard alarm={find(alarms, { id: content }) as Alarm} />
        )}
        sections={map(alarms, "id")}
      />
    </ScrollView>
  );
}
