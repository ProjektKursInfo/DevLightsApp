import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Headline, useTheme } from "react-native-paper";
import { Theme } from "react-native-paper/lib/typescript/src/types";
import { Light } from "../../interfaces";
import getContrastTextColor from "../textContrast";

export interface CardProps {
  light: Light;
}

export default function Card(props: CardProps): JSX.Element {
  const theme: Theme = useTheme();
  const colors = props.light.leds.colors;
  const styles = StyleSheet.create({
    card: {
      borderRadius: theme.roundness * 2,
      width: "80%",
      height: 120,
      marginTop: 10,
      elevation: 20,
    },
    headline: {
      position: "absolute",
      top: 16,
      left: 16,
      color: getContrastTextColor(colors[0]),
    },
  });

  const navigation = useNavigation();
  const onPress = (): void => {
    navigation.navigate("light", {
      name: props.light.name ? props.light.name : undefined,
      id: props.light.uuid,
      pattern: props.light.leds.pattern,
      colors: colors,
      count: props.light.count,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <LinearGradient
        style={styles.card}
        colors={[colors[0], colors[1] ?? colors[0]]}
        start={[0, 1]}
        end={[1, 0]}
      >
        <Headline style={styles.headline}>
          {props.light.name ?? "Name not avaible"}
        </Headline>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
/* export interface ActionIconProps {
  icon: IconProp;
  color: string;
  onClick(e: GestureResponderEvent): void;
}
function ActionIcon(props: ActionIconProps) {
  const style = StyleSheet.create({
    icon: {
      position: "absolute",
      right: 16,
      top: 16,
    },
  });
  return (
    <TouchableOpacity onPress={props.onClick}>
      <FontAwesomeIcon
        style={style.icon}
        color={props.color}
        icon={props.icon}
        size={36}
      />
    </TouchableOpacity>
  );
}
 */
