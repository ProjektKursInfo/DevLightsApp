import { Alarm, PartialLight, Response } from "@devlights/types";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/core";
import axios, { AxiosResponse } from "axios";
import { isEqual, map, remove } from "lodash";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Divider, List, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../../store";
import { editAlarm, removeAlarm } from "../../store/actions/alarms";
import { checkAlarmEquality } from "../../utils";
import Circle from "../Circle";
import DayChip from "../DayChip";

export interface AlarmCardProps {
  id: string;
}

export default function AlarmCard(props: AlarmCardProps): JSX.Element {
  const { id } = props;
  const alarm = useSelector(
    (state: Store) => state.alarms.find((a: Alarm) => a.id === id) as Alarm,
    (l: Alarm, r: Alarm) => checkAlarmEquality(l, r),
  );
  const dispatch = useDispatch();
  const [days, setDays] = React.useState<number[]>(alarm.days);
  const [color, setColor] = React.useState<string>(alarm.color);
  const navigation = useNavigation();
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

  const handleAlarmEdit = async (data: any, key: string): Promise<boolean> => {
    let success = true;
    const ax = axios.patch(`http://devlight/alarm/${alarm.id}`, {
      [key]: data,
    });
    ax.then((res: AxiosResponse<Response<Alarm>>) => {
      success = true;
      setColor(res.data.object.color);
      dispatch(editAlarm(res.data.object));
    });
    ax.catch(() => {
      success = false;
    });
    return success;
  };

  const onSubmit = async (color: string): Promise<boolean> =>
    handleAlarmEdit(color, "color");

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

  const onPress = () => {
    navigation.navigate("color_modal", {
      color: alarm.color,
      onSubmit,
    });
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
        <Circle colors={[color]} />
        <Button onPress={onPress} color={color}>
          {color}
        </Button>
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
