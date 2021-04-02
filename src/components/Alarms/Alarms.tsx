import { Alarm, Response } from "@devlights/types";
import axios, { AxiosResponse } from "axios";
import { find, isEqual, map } from "lodash";
import moment from "moment";
import React from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import { Switch, Text, Title, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../../store";
import { editAlarm, setAlarms } from "../../store/actions/alarms";
import AlarmCard from "../AlarmCard/AlarmCard";

export function Header(props: { id: string }): JSX.Element {
  const { id } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const alarm = useSelector(
    (state: Store) => state.alarms.find((a: Alarm) => a.id === id) as Alarm,
    (l: Alarm, r: Alarm) => isEqual(l.isOn, r.isOn),
  );
  const [isOn, setIsOn] = React.useState<boolean>(alarm.isOn);
  const [visible, setVisible] = React.useState<boolean>(false);
  const handleValueChange = (value: boolean) => {
    const old = alarm.isOn;
    setIsOn(value);
    axios
      .patch(`http://devlight/alarm/${id}`, {
        isOn: value,
      })
      .then((res: AxiosResponse<Response<Alarm>>) => {
        dispatch(editAlarm(res.data.object));
      })
      .catch((err) => {
        setIsOn(old);
      });
  };

  const styles = StyleSheet.create({
    headerText: {
      fontSize: 30,
      marginLeft: theme.spacing(5),
      paddingVertical: theme.spacing(2),
    },
  });
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <TouchableWithoutFeedback onLongPress={() => setVisible(true)}>
        <Text style={styles.headerText}>{alarm?.time ?? "UNDEFINED"}</Text>
      </TouchableWithoutFeedback>
      <Switch
        onValueChange={(value: boolean) => handleValueChange(value)}
        style={{ alignItems: "center" }}
        value={isOn}
        disabled={alarm === undefined}
      />
    </View>
  );
}

export default function Alarms(): JSX.Element {
  const alarms: Alarm[] =
    useSelector(
      (state: Store) => state.alarms,
      (l: Alarm[], r: Alarm[]) => isEqual(l, r),
    ) || [];
  const dispatch = useDispatch();
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
      {alarms.length > 0 ? (
        <Accordion
          activeSections={activeSections}
          containerStyle={styles.container}
          sectionContainerStyle={{
            width: Dimensions.get("window").width - theme.spacing(2),
            marginHorizontal: theme.spacing(1),
          }}
          underlayColor="rgba(255,255,255,0.3)"
          onChange={(indexes: number[]) => setActiveSections(indexes)}
          renderHeader={(content: string) => <Header id={content} />}
          renderContent={(content: string) => <AlarmCard id={content} />}
          sections={map(alarms, "id")}
        />
      ) : (
        <Text> Sorry! There arent any alarms yet</Text>
      )}
    </ScrollView>
  );
}
