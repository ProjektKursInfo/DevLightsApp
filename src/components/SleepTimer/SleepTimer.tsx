import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useTheme } from "react-native-paper";
import { Light, Response } from "@devlights/types";
import moment from "moment";
import useSnackbar from "../../hooks/useSnackbar";
import { LightResponse } from "../../interfaces/types";

export interface SleepTimerProps {
  id: string;
  type: "light" | "tag";
  visible: boolean;
  onConfirm: () => void;
}
export default function SleepTimer(props: SleepTimerProps): JSX.Element {
  const { id, visible, onConfirm, type } = props;
  const snackbar = useSnackbar();
  const theme = useTheme();
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);

  const onChange = (event: any, time?: Date) => {
    if (time) {
      const url =
        type === "light"
          ? `/lights/${id}/off/schedule`
          : `/tags/${id}/off/schedule`;
      const minutes = time.getMinutes() + time.getHours() * 60;
      axios
        .post(url, {
          minute: minutes,
        })
        .then((res: LightResponse | AxiosResponse<Response<Light[]>>) => {
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
