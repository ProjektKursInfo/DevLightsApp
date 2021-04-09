import { Alarm, PartialLight, Response } from "@devlights/types";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/core";
import axios, { AxiosResponse } from "axios";
import { filter, map, remove } from "lodash";
import * as React from "react";
import { Dimensions, StyleSheet, TextInput, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Button, Chip, IconButton, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import useSnackbar from "../../hooks/useSnackbar";
import { Store } from "../../store";
import { editAlarm, removeAlarm } from "../../store/actions/alarms";
import { checkAlarmEquality } from "../../utils";
import ApplyDialog from "../ApplyDialog";
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
  const modalizeRef = React.useRef<Modalize>(null);
  const navigation = useNavigation();
  const theme: ReactNativePaper.Theme = useTheme();
  const snackbar = useSnackbar();
  const ref = React.useRef<TextInput>(null);

  const handleDelete = () => {
    axios
      .delete(`/alarm/${alarm.id}`)
      .then(() => {
        dispatch(removeAlarm(alarm));
      });
  };

  const handleAlarmEdit = async (data: any, key: string): Promise<boolean> => {
    try {
      const res: AxiosResponse<Response<Alarm>> = await axios.patch(
        `/alarm/${alarm.id}`,
        {
          [key]: data,
        },
      );
      setColor(res.data.object.color);
      dispatch(editAlarm(res.data.object));
      return true;
    } catch {
      return false;
    }
  };

  const onSubmit = async (pColor: string): Promise<boolean> =>
    handleAlarmEdit(pColor, "color");

  const handleCheckedChange = async (
    day: number,
    checked: boolean,
  ): Promise<void> => {
    const wDays = [...days];
    const old = wDays;
    if (checked) {
      wDays.push(day);
    } else if (wDays.length > 1) {
      remove(wDays, (d: number) => d === day);
    } else {
      snackbar.makeSnackbar(
        "Alarm must be active for at least one day",
        theme.colors.error,
      );
      return;
    }
    setDays(wDays);
    if (!(await handleAlarmEdit(wDays, "days"))) setDays(old);
  };

  const handleColorChange = () => {
    navigation.navigate("color_modal", {
      color: alarm.color,
      onSubmit,
    });
  };

  const styles = StyleSheet.create({
    root: {
      marginHorizontal: theme.spacing(3),
      width: Dimensions.get("window").width - theme.spacing(3) * 2,
      marginBottom: theme.spacing(2),
    },
    day_chip_container: {
      marginTop: theme.spacing(2),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    chip_container: {
      marginTop: theme.spacing(4),
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      width: "100%",
      flexWrap: "wrap",
    },
    chip: {
      maxHeight: 40,
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(1),
      justifyContent: "center",
      alignItems: "center",
    },
    lights: {
      marginTop: theme.spacing(2),
    },
    button: {
      width: "60%",
    },
    addButton: {
      marginLeft: 0,
    },
    color_container: {
      marginTop: theme.spacing(3),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    icon: {
      alignSelf: "center",
    },
    delete_item: {
      marginLeft: theme.spacing(2),
    },
    textinput: {
      flex: 2,
      color: theme.colors.text,
      fontSize: 20,
      fontFamily: "TitilliumWeb-Bold",
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.root}>
      <View style={{ flexDirection: "row" }}>
        <IconButton icon="label-outline" />
        <TextInput
          ref={ref as React.RefObject<TextInput>}
          onSubmitEditing={({ nativeEvent: { text } }) => {
            if (text !== "") handleAlarmEdit(text, "name");
            else ref.current?.setNativeProps({ text: alarm.name });
          }}
          textAlign="left"
          style={styles.textinput}
          defaultValue={alarm.name}
        />
      </View>
      <View style={styles.day_chip_container}>
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

      <View style={styles.chip_container}>
        {alarm.lights.map((l: PartialLight, i: number) => (
          <Chip
            key={l.id}
            onPress={() => navigation.navigate("light", { id: l.id })}
            style={styles.chip}
            onClose={() => {
              if (alarm.lights.length > 1) {
                handleAlarmEdit(
                  map(
                    filter(
                      alarm.lights,
                      (light: PartialLight) => light.id !== l.id,
                    ),
                    "id",
                  ),
                  "ids",
                );
              } else {
                snackbar.makeSnackbar(
                  "Alarm must have at least one Light",
                  theme.colors.error,
                );
              }
            }}
          >
            {alarm.lights[i].name}
          </Chip>
        ))}
        <IconButton
          style={styles.addButton}
          onPress={() => modalizeRef.current?.open()}
          icon={() => (
            <FontAwesomeIcon
              size={22}
              color={theme.colors.accent}
              icon={faPlus}
            />
          )}
          size={20}
        />
      </View>

      <View style={styles.color_container}>
        <Button
          color={alarm.color}
          style={styles.button}
          mode="contained"
          onPress={handleColorChange}
        >
          {color}
        </Button>
        <IconButton
          size={30}
          onPress={handleDelete}
          icon={() => (
            <FontAwesomeIcon
              style={styles.icon}
              icon={faTrash}
              size={28}
              color={theme.colors.error}
            />
          )}
        />
      </View>

      <ApplyDialog
        title="Lights for Alarm"
        confirmText="Apply lights"
        ref={modalizeRef}
        onConfirm={(ids: string[]) => {
          handleAlarmEdit(ids, "ids");
          modalizeRef.current?.close();
        }}
        ids={map(alarm.lights, "id")}
        ignoreLightOff
      />
    </View>
  );
}
