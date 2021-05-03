import { Light } from "@devlights/types";
import { isEqual } from "lodash";
import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useSelector } from "react-redux";
import { Store } from "../../store";
import GradientComponent from "../GradientComponent";
import PlainComponent from "../PlainComponent";
import RainbowComponent from "../RainbowComponent";
import RunnerComponent from "../RunnerComponent";

export default function PatternComponent(props: { id: string }): JSX.Element {
  const light = useSelector(
    (state: Store) =>
      state.lights.find((l: Light) => l.id === props.id) as Light,
    (l: Light, r: Light) => isEqual(l.leds.pattern, r.leds.pattern),
  );
  const styles = StyleSheet.create({
    text: {
      textAlign: "center",
    },
  });

  const getComponent = () => {
    switch (light.leds.pattern) {
      case "gradient":
        return <GradientComponent id={light.id} />;
      case "plain":
        return <PlainComponent id={light.id} />;
      case "runner":
        return <RunnerComponent id={light.id} />;
      case "rainbow":
      case "fading":
        return <RainbowComponent id={light.id} />;
      default:
        return (
          <Text style={styles.text}>
            The Light is currently in a mode where changing the Color is not
            supported.
          </Text>
        );
    }
  };

  return <>{getComponent()}</>;
}
