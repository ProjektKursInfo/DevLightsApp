import { useNavigation } from "@react-navigation/native";
import { isEqual } from "lodash";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { Light } from "../../interfaces";
import { Store } from "../../store";
import { ColorModalScreenNavigationProp } from "../Navigation/Navigation";

export interface GradientComponentProps {
  id: string;
}

export default function GradientComponent(props: GradientComponentProps) : JSX.Element {
  const navigation = useNavigation<ColorModalScreenNavigationProp>();
  const light: Light = useSelector(
    (state: Store) => (
      state.lights.find((l: Light) => l.uuid === props.id) as Light),
    (left: Light, right: Light) => !isEqual(left.leds.colors, right.leds.colors),
  );

  const onPress = (index: number) => {
    navigation.navigate("color_modal", {
      id: props.id,
      index,
    });
  };

  const styles = StyleSheet.create({
    button_left: {
      width: "40%",
      alignSelf: "center",
      margin: 20,
    },
    container: {
      flexDirection: "row",
      alignSelf: "center",
      alignContent: "space-between",
    },
  });
  return (
    <View style={styles.container}>
      <Button
        disabled={!light.isOn}
        mode="contained"
        style={styles.button_left}
        onPress={() => onPress(0)}
        color={light.leds.colors[0]}
      >
        {light.leds.colors[0]}
      </Button>
      <Button
        disabled={!light.isOn}
        mode="contained"
        style={styles.button_left}
        onPress={() => onPress(1)}
        color={light.leds.colors[1]}
      >
        {light.leds.colors[1]}
      </Button>
    </View>
  );
}
