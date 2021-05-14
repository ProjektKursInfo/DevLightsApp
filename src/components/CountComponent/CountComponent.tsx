import { Light } from "@devlights/types";
import axios from "axios";
import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";
import { LightResponse } from "../../interfaces/types";
import useSnackbar from "../../hooks/useSnackbar";
import { setLight } from "../../store/actions/lights";

export interface CountComponentProps {
  light: Light;
}
export default function CountComponent(
  props: CountComponentProps,
): JSX.Element {
  const { light } = props;
  const ref = React.useRef<TextInput>();
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const theme = useTheme();
  const changeLedCount = (count: string) => {
    if (!/^\d+$/.test(count) || parseInt(count, 10) > 1000) {
      snackbar.makeSnackbar(
        "Invalid number provided! Must be from ",
        theme.colors.error,
      );
      if (ref) {
        ref.current?.setNativeProps({ text: light.count.toString() });
      }
    } else {
      axios
        .patch(`/lights/${light.id}/count`, {
          count: parseInt(count, 10),
        })
        .then((res: LightResponse) => {
          dispatch(setLight(light.id, res.data.object));
          snackbar.makeSnackbar(res.data.message, theme.colors.success);
        });
    }
  };
  const styles = StyleSheet.create({
    textinput: {
      flex: 2,
      color: theme.colors.text,
      fontSize: 20,
      fontFamily: "TitilliumWeb-Bold",
      fontWeight: "600",
    },
  });
  return (
    <TextInput
      editable={light.isOn}
      ref={ref as React.RefObject<TextInput>}
      keyboardType="number-pad"
      onSubmitEditing={({ nativeEvent: { text } }) => changeLedCount(text)}
      textAlign="right"
      style={styles.textinput}
      defaultValue={light.count.toString()}
    />
  );
}
