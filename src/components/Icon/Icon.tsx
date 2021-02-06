import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

export default function Icon(
  props: StackHeaderLeftButtonProps & {
    icon: IconProp;
    color: string;
    position: "left" | "right";
  },
): JSX.Element {
  const { onPress, icon, color, position } = props;
  const styles = StyleSheet.create({
    icon: {
      marginLeft: position === "left" ? 30 : 0,
      marginRight: position === "right" ? 30 : 0,
      marginTop: 20,
    },
  });
  return (
    <Pressable onPress={onPress}>
      <FontAwesomeIcon
        style={styles.icon}
        color={color}
        size={30}
        icon={icon}
      />
    </Pressable>
  );
}
