import { Light } from "@devlights/types";
import { isEqual } from "lodash";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Text, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import useLight from "../../hooks/useLight";
import { Store } from "../../store";

export interface RunnerComponentProps {
  id: string;
}

export default function RunnerComponent(
  props: RunnerComponentProps,
): JSX.Element {
  const theme = useTheme();
  const lights = useLight();
  const ref = React.useRef<TextInput>();
  const light: Light = useSelector(
    (state: Store) => state.lights.find((l: Light) => l.id === props.id) as Light,
    (left: Light, right: Light) => isEqual(left.leds.timeout, right.leds.timeout),
  );

  // maybe number as parameter
  const changeTimeout = (timeout: string) => {
    if (parseInt(timeout, 10) !== light.leds.timeout) {
      lights
        .setColor(light.id, [], light.leds.pattern, parseInt(timeout, 10))
        .catch(() => {
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
