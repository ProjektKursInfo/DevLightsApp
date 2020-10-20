import { useNavigation } from "@react-navigation/native";
import * as React from "react";
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
