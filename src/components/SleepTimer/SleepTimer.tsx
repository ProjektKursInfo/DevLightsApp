import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios, { AxiosError } from "axios";
import { useTheme } from "react-native-paper";
import useSnackbar from "../../hooks/useSnackbar";
import { LightResponse } from "../../interfaces/types";
import moment from "moment";

export interface SleepTimerProps {
  id: string;
  visible: boolean;
  onConfirm: () => void;
}
export default function SleepTimer(props: SleepTimerProps): JSX.Element {
  const { id, visible, onConfirm } = props;
  const snackbar = useSnackbar();
  const theme = useTheme();
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);

  const onChange = (event: any, time?: Date) => {
    if (time) {
      const minutes = time.getMinutes() + time.getHours() * 60;
      axios
        .post(`/lights/${id}/off/schedule`, {
          minute: minutes,
        })
        .then((res: LightResponse) => {
          onConfirm();
          snackbar.makeSnackbar(res.data.message, theme.colors.success);
        })
        .catch((err: AxiosError) => {
          onConfirm();
          snackbar.makeSnackbar(err.response?.data.message, theme.colors.error);
        });
    } else {
      onConfirm();
    }
  };
  return (
    <>
      {visible && (
        <DateTimePicker
          mode="time"
          display="spinner"
          value={new Date(moment().year(), moment().month(), 0, 0, 0)}
          onChange={onChange}
        />
      )}
    </>
  );
}
