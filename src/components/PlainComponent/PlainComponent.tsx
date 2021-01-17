import { useNavigation } from "@react-navigation/native";
import { isEqual } from "lodash";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { Light } from "../../interfaces";
import { Store } from "../../store";
import { ColorModalScreenNavigationProp } from "../Navigation/Navigation";

export interface PlainComponentProps {
  id: string;
}

export default function PlainComponent(
  props: PlainComponentProps,
): JSX.Element {
  const navigation = useNavigation<ColorModalScreenNavigationProp>();
  const light: Light = useSelector(
    (state: Store) => (
      state.lights.find((l: Light) => l.uuid === props.id) as Light),
    (left: Light, right: Light) => !isEqual(left.leds.colors, right.leds.colors)
  );

  React.useEffect(() => {
    console.log("update");
  }, [light]);

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
