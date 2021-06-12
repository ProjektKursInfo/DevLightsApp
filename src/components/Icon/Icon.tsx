import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";

export interface IconProps extends PressableProps {
  icon: IconProp;
  color: string;
  position: "left" | "right";
}

export default function Icon(props: IconProps): JSX.Element {
  const { onPress, icon, color, position, ...rest } = props;
  const styles = StyleSheet.create({
    icon: {
      marginLeft: position === "left" ? 30 : 0,
      marginRight: position === "right" ? 30 : 0,
    },
  });
  return (
    <Pressable onPress={onPress} {...rest}>
      <FontAwesomeIcon
        style={styles.icon}
        color={color}
        size={30}
        icon={icon}
      />
    </Pressable>
  );
}
