import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPlug, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Headline, useTheme } from "react-native-paper";
import { Theme } from "react-native-paper/lib/typescript/src/types";
import getContrastTextColor from "../textContrast/";
/*  */
export interface CardProps {
  setup?: boolean;
  ip: string;
  name?: string;
  colors: string[];
  style?: object;
}

export interface CardState {}

export default function Card(props: CardProps): JSX.Element {
  const theme: Theme = useTheme();
  const colors = props.colors;
  const styles: StyleSheet = StyleSheet.create({
    card: {
      borderRadius: theme.roundness * 2,
      width: "80%",
      height: 120,
      marginTop: 10,
      elevation: 20,
      ...props.style,
    },
    headline: {
      position: "absolute",
      top: 16,
      left: 16,
      color: getContrastTextColor(colors[0]),
    },
  });

  const navigation = useNavigation();
  const onPress: VoidFunction = () => {
    console.log("pressed");
    navigation.navigate("light", {
      ip: props.ip,
      name: props.name ? props.name : undefined,
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
        <Headline style={styles.headline}>{props.name ?? props.ip}</Headline>
        {props.setup ? (
          <ActionIcon
            onClick={onPress}
            icon={faPowerOff}
            color={getContrastTextColor(colors[1] ?? colors[0])}
          />
        ) : (
          <ActionIcon
            onClick={onPress}
            icon={faPlug}
            color={getContrastTextColor(colors[1] ?? colors[0])}
          />
        )}
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
export interface ActionIconProps {
  icon: IconProp;
  color: string;
  onClick(e: GestureResponderEvent): void;
}
function ActionIcon(props: ActionIconProps) {
  const style: StyleSheet = StyleSheet.create({
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
