import { Light } from "@devlights/types";
import { useNavigation } from "@react-navigation/native";
import axios, { AxiosResponse } from "axios";
import { isEqual } from "lodash";
import * as React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { LightResponse } from "../../interfaces/types";
import { Store } from "../../store";
import { setLight, setLightColor } from "../../store/actions/lights";
import { ColorModalScreenNavigationProp } from "../ColorPicker/ColorPicker";

export interface RunnerComponentProps {
  colors: string[];
  timeout: number;
  disabled: boolean;
  onSubmit: (color: string, timeout?: number) => Promise<boolean>;
}

export default function RunnerComponent(
  props: RunnerComponentProps,
): JSX.Element {
  const { colors, timeout, disabled, onSubmit } = props;
  const navigation = useNavigation<ColorModalScreenNavigationProp>();
  const theme = useTheme();
  const dispatch = useDispatch();
  const ref = React.useRef<TextInput>();
  /* const light: Light = useSelector(
    (state: Store) => state.lights.find((l: Light) => l.id === id) as Light,
    (l: Light, r: Light) =>
      isEqual(l.leds.timeout, r.leds.timeout) ||
      isEqual(l.leds.colors[0], r.leds.colors[0]),
  ); */

  /* const onSubmit = async (color: string): Promise<boolean> => {
    let success = true;

    const ax = axios.patch(`/lights/${id}/color`, {
      colors: [color],
      pattern: light.leds.pattern,
      timeout: light.leds.timeout,
    });
    await ax.then((res: LightResponse) => {
      dispatch(
        setLightColor(
          id,
          "runner",
          res.data.object.leds.colors,
          light.leds.timeout,
        ),
      );
      success = true;
    });
    await ax.catch((err) => {
      success = false;
    });

    return success;
  }; */

  const onPress = () => {
    navigation.navigate("color_modal", {
      color: colors[0],
      onSubmit,
      index: 0,
    });
  };

  const styles = StyleSheet.create({
    button: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
    },
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
          editable={!disabled}
          ref={ref as React.RefObject<TextInput>}
          keyboardType="number-pad"
          onSubmitEditing={({ nativeEvent: { text } }) =>
            onSubmit(colors[0], parseInt(text, 10))
          }
          textAlign="right"
          style={styles.textinput}
          defaultValue={timeout?.toString() ?? "100"}
        />
      </View>
      <Button
        disabled={disabled}
        mode="contained"
        style={styles.button}
        onPress={onPress}
        color={colors[0]}
      >
        {colors[0]}
      </Button>
    </View>
  );
}
