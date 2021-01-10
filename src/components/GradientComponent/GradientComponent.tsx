import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import Axios from "axios";
import { isEqual } from "lodash";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Light } from "../../interfaces";
import { Store } from "../../store";
import { ColorModalScreenNavigationProp } from "../Navigation/Navigation";
import { EDIT_LIGHT_COLOR } from "../../store/actions/types";
import useLight from "../../hooks/useLight";

export interface GradientComponentProps {
  colors: string[];
  id: string;
  pattern: string;
}

export default function GradientComponent(props: GradientComponentProps) {
  const navigation = useNavigation<ColorModalScreenNavigationProp>();
  const dispatch = useDispatch();
  
  const light: Light = useSelector(
    (state: Store) =>
      state.lights.find((l: Light) => l.uuid === props.id) as Light,
    (left: Light, right: Light) => !isEqual(left.leds.colors, right.leds.colors)
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
      alignContent: "space-between"
    },
  });
  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        style={styles.button_left}
        onPress={() => onPress(0)}
        color={light.leds.colors[0]}
      >
        {light.leds.colors[0]}
      </Button>
      <Button
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
