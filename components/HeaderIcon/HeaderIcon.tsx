import * as React from "react";
import { Component } from "react";
import { faHamburger } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { IconButton, useTheme } from "react-native-paper";

export default function HeaderIcon() {
  const navigation = useNavigation().dangerouslyGetParent();
  const theme = useTheme();
  return (
    <IconButton
      onPress={navigation?.toggleDrawer}
      color={theme.colors.primary}
      icon={"menu"}
    ></IconButton>
  );
}
