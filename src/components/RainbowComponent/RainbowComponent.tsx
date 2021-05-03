import { Light } from "@devlights/types";
import axios from "axios";
import { isEqual } from "lodash";
import * as React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { LightResponse } from "../../interfaces/types";
import { Store } from "../../store";
import { setLight, setLightColor } from "../../store/actions/lights";

export interface RunnerComponentProps {
  id: string;
}

export default function RunnerComponent(
  props: RunnerComponentProps,
): JSX.Element {
  const { id } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const ref = React.useRef<TextInput>();
  const light: Light = useSelector(
    (state: Store) => state.lights.find((l: Light) => l.id === id) as Light,
    (l: Light, r: Light) => isEqual(l.leds.timeout, r.leds.timeout),
  );

  // maybe number as parameter
  const changeTimeout = (timeout: string) => {
    if (parseInt(timeout, 10) !== light.leds.timeout) {
      const ax = axios.patch(`/lights/${light.id}/color`, {
        pattern: light.leds.pattern,
        timeout: parseInt(timeout, 10),
      });
      ax.then((res: LightResponse) =>
        dispatch(
          setLightColor(
            id,
            "rainbow",
            res.data.object.leds.colors,
            light.leds.timeout,
          ),
        ),
      );
      ax.catch(() => {
        // @ts-ignore
        ref.current?.setNativeProps({ text: light.leds.timeout?.toString() });
      });
    }
  };

  const styles = StyleSheet.create({
    timeoutContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginLeft: theme.spacing(8),
      marginRight: theme.spacing(5),
    },
    title: {
      flex: 3,
      textAlignVertical: "center",
      fontSize: 20,
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
    <View>
      <View style={styles.timeoutContainer}>
        <Text style={styles.title}>Timeout</Text>
        <TextInput
          editable={light.isOn}
          ref={ref as React.RefObject<TextInput>}
          keyboardType="number-pad"
          onSubmitEditing={({ nativeEvent: { text } }) => changeTimeout(text)}
          textAlign="right"
          style={styles.textinput}
          defaultValue={light.leds.timeout?.toString() ?? "100"}
        />
      </View>
    </View>
  );
}
