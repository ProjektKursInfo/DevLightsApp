import { useNavigation } from "@react-navigation/native";
import { isEqual } from "lodash";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { Light } from "@devlights/types";
import { Store } from "../../store";
import { ColorModalScreenNavigationProp } from "../ColorPicker/ColorPicker";
import useLight from "../../hooks/useLight";
import { makeValidColorArray } from "../../utils";

export interface PlainComponentProps {
  id: string;
}

export default function PlainComponent(
  props: PlainComponentProps,
): JSX.Element {
  const { id } = props;
  const navigation = useNavigation<ColorModalScreenNavigationProp>();
  const lights = useLight();
  const light: Light = useSelector(
    (state: Store) => state.lights.find((l: Light) => l.id === id) as Light,
    (l: Light, r: Light) => !isEqual(l.leds.colors, r.leds.colors),
  );

  const onSubmit = async (color: string): Promise<boolean> => {
    let success = true;
    const newColors = makeValidColorArray(color, light.leds.colors, 0);
    const ax = lights.setColor(
      light.id,
      newColors,
      light.leds.pattern,
      undefined,
    );
    await ax.then(() => {
      success = true;
    });
    await ax.catch(() => {
      success = false;
    });

    return success;
  };

  const onPress = () => {
    navigation.navigate("color_modal", {
      color: light.leds.colors[0],
      onSubmit,
    });
  };

  const styles = StyleSheet.create({
    button: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
    },
  });
  return (
    <View>
      <Button
        disabled={!light.isOn}
        mode="contained"
        style={styles.button}
        onPress={onPress}
        color={light.leds.colors[0]}
      >
        {light.leds.colors[0]}
      </Button>
    </View>
  );
}
