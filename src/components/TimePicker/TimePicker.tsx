import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export interface TimePickerProps {
  visible: boolean;
  time: string;
  close: () => void;
  onConfirm: (time: string) => void;
}

export default function TimePicker(props: TimePickerProps): JSX.Element {
  const { visible, time } = props;
  const timeArr: string[] = time.split(":");
  const oldDate: Date = new Date();
  oldDate.setHours(parseInt(timeArr[0], 10));
  oldDate.setMinutes(parseInt(timeArr[1], 10));

  const onChange = (event: any, selectedDate?: Date): void => {
    props.close();
    if (event.type === "set") {
      const newTime = moment(selectedDate).format("HH:mm");
      props.onConfirm(newTime);
    }
  };
  return (
    <View>
      {visible && (
        <DateTimePicker
          testID="dateTimePicker"
          value={oldDate}
          mode="time"
          is24Hour
          themeVariant="dark"
          display="default"
          dateFormat="longdate"
          onChange={onChange}
        />
      )}
    </View>
  );
}
