import { faStream } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export default function HeaderIcon(): JSX.Element {
  const navigation = useNavigation().dangerouslyGetParent();

  const theme = useTheme();
  const styles = StyleSheet.create({
    icon: { marginLeft: 30, marginTop: 20 },
  });
  return (
    <Pressable onPress={navigation?.toggleDrawer}>
      <FontAwesomeIcon icon={faStream} size={30} color={theme.colors.accent} style={styles.icon} />
    </Pressable>
  );
}
