import { Alarm, Response } from "@devlights/types";
import axios, { AxiosResponse } from "axios";
import { isEqual } from "lodash";
import React from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import {
  Divider,
  TouchableRipple,
  Text,
  useTheme,
  Switch,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../../store";
import { editAlarm } from "../../store/actions/alarms";
import TimePicker from "../TimePicker";

export default function AlarmHeader(props: {
  id: string;
  index: number;
}): JSX.Element {
  const { id, index } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const alarm = useSelector(
    (state: Store) => state.alarms.find((a: Alarm) => a.id === id) as Alarm,
    (l: Alarm, r: Alarm) => isEqual(l.isOn, r.isOn) && isEqual(l.time, r.time),
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
      .catch(() => {
        setIsOn(old);
      });
  };

  const handleTimeChange = (time: string) => {
    axios
      .patch(`http://devlight/alarm/${id}`, {
        time,
      })
      .then((res: AxiosResponse<Response<Alarm>>) => {
        dispatch(editAlarm(res.data.object));
      });
  };

  const styles = StyleSheet.create({
    root: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    ripple: {
      marginLeft: theme.spacing(3),
    },
    headerText: {
      fontSize: 30,
      margin: theme.spacing(1),
      padding: theme.spacing(1),
    },
    switch: { alignItems: "center", marginRight: theme.spacing(4) },
    divider: {
      marginHorizontal: theme.spacing(3),
    },
  });
  return (
    <>
      {index > 0 ? <Divider style={styles.divider} /> : undefined}
      <View style={styles.root}>
        <TouchableRipple
          style={styles.ripple}
          onPress={(e: GestureResponderEvent) => {
            e.pro;
            setVisible(true);
          }}
        >
          <Text style={styles.headerText}>{alarm?.time ?? "UNDEFINED"}</Text>
        </TouchableRipple>
        <TimePicker
          visible={visible}
          close={() => setVisible(false)}
          onConfirm={handleTimeChange}
          time={alarm.time}
        />
        <Switch
          onValueChange={(value: boolean) => handleValueChange(value)}
          style={styles.switch}
          value={isOn}
          color={alarm.color}
          disabled={alarm === undefined}
        />
      </View>
    </>
  );
}
