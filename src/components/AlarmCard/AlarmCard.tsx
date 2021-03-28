import { Alarm, PartialLight, Response } from "@devlights/types";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import axios, { AxiosResponse } from "axios";
import { map, remove } from "lodash";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Divider, List, Text, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";
import { editAlarm, removeAlarm } from "../../store/actions/alarms";
import Circle from "../Circle";
import DayChip from "../DayChip";

export interface AlarmCardProps {
  alarm: Alarm;
}

export default function AlarmCard(props: AlarmCardProps): JSX.Element {
  const { alarm } = props;
  const dispatch = useDispatch();
  const [days, setDays] = React.useState<number[]>(alarm.days);

  const theme: ReactNativePaper.Theme = useTheme();

  const styles = StyleSheet.create({
    chip_container: {
      marginTop: theme.spacing(2),
      flexDirection: "row",
      marginHorizontal: theme.spacing(1),
    },
    chip: {
      marginRight: theme.spacing(2),
    },
    color_container: {
      flexDirection: "row",
      marginLeft: theme.spacing(8),
      marginTop: theme.spacing(4),
    },
    divider: {
      margin: theme.spacing(3),
    },
    icon: {
      alignSelf: "center",
    },
    delete_item: {
      marginLeft: theme.spacing(2),
    },
  });

  const handleDelete = () => {
    axios
      .delete(`http://devlight/alarm/${alarm.id}`)
      .then((res: AxiosResponse<Response<Alarm>>) => {
        dispatch(removeAlarm(res.data.object));
      })
      .catch(() => {
        // console.log("an error orrcurred while deleting alarm");
      });
  };

  const handleAlarmEdit = (data: any, key: string): boolean => {
    let success = true;
    axios
      .patch(`http://devlight/alarm/${alarm.id}`, {
        [key]: data,
      })
      .then((res: AxiosResponse<Response<Alarm>>) => {
        dispatch(editAlarm(res.data.object));
      })
      .catch(() => {
        success = false;
      });
    return success;
  };

  const handleCheckedChange = async (day: number, checked: boolean): void => {
    const wDays = [...days];
    const old = wDays;
    if (checked) {
      wDays.push(day);
    } else {
      remove(wDays, (d: number) => d === day);
    }
    setDays(wDays);
    if (!handleAlarmEdit(wDays, "days")) setDays(old);
  };
  return (
    <View>
      <View style={styles.chip_container}>
        <DayChip
          day={1}
          selected={days.includes(1)}
          onCheckedChanged={handleCheckedChange}
        />
        <DayChip
          day={2}
          selected={days.includes(2)}
          onCheckedChanged={handleCheckedChange}
        />
        <DayChip
          day={3}
          selected={days.includes(3)}
          onCheckedChanged={handleCheckedChange}
        />
        <DayChip
          day={4}
          selected={days.includes(4)}
          onCheckedChanged={handleCheckedChange}
        />
        <DayChip
          day={5}
          selected={days.includes(5)}
          onCheckedChanged={handleCheckedChange}
        />
        <DayChip
          day={6}
          selected={days.includes(6)}
          onCheckedChanged={handleCheckedChange}
        />
        <DayChip
          day={0}
          selected={days.includes(7) || days.includes(0)}
          onCheckedChanged={handleCheckedChange}
        />
      </View>
      <View style={styles.color_container}>
        <Circle colors={[alarm.color]} />
        <Button color={alarm.color}>{alarm.color}</Button>
      </View>
      <Divider style={styles.divider} />
      <List.Item
        onPress={handleDelete}
        style={styles.delete_item}
        title="Delete Alarm"
        left={() => (
          <FontAwesomeIcon
            style={styles.icon}
            icon={faTrash}
            size={26}
            color={theme.colors.primary}
          />
        )}
      />
      <Divider style={styles.divider} />
    </View>
  );
}
