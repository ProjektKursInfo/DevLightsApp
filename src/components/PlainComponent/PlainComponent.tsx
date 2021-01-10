import { useNavigation } from "@react-navigation/native";
import Axios from "axios";
import { isEqual } from "lodash";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Leds, Light } from "../../interfaces";
import { Store } from "../../store";
import { EDIT_LIGHT_COLOR } from "../../store/actions/types";
import { ColorModalScreenNavigationProp } from "../Navigation/Navigation";

export interface PlainComponentProps {
  colors: string[];
  id: string;
  pattern: string;
}

export default function PlainComponent(
  props: PlainComponentProps
): JSX.Element {
  const navigation = useNavigation<ColorModalScreenNavigationProp>();
  const dispatch = useDispatch();
  const light: Light = useSelector(
    (state: Store) =>
      state.lights.find((l: Light) => l.uuid === props.id) as Light,
    (left: Light, right: Light) => !isEqual(left.leds.colors, right.leds.colors)
  );

  const onPress = () => {
    navigation.navigate("color_modal", {
      id: props.id,
      index: 0,
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
