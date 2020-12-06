import { useNavigation } from "@react-navigation/native";
import { isEqual } from "lodash";
import * as React from "react";
import { StyleSheet,  View,  ViewStyle } from "react-native";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { Leds, Light } from "../../interfaces";
import { Store } from "../../store";

export interface PlainComponentProps {
  colors: string[];
  id: string;
  pattern: string;
}

export default function PlainComponent(props: PlainComponentProps): JSX.Element {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("color_modal", {
      id: props.id,
    });
  };
  const leds: Leds = useSelector(
    (state: Store) => state.lights.find((l: Light) => l.uuid === props.id)?.leds as Leds,
    (left: Leds, right: Leds) => !isEqual(left.colors, right.colors),
  );
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
        color={leds.colors[0]}
      >
        {leds.colors[0]}
      </Button>
    </View>
  );
}
