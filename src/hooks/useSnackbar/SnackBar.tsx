import * as React from "react";
import { StyleSheet } from "react-native";
import { Snackbar as PaperBar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import getContrastTextColor from "../../components/textContrast";

export interface SnackbarProps {
  color: string;
  message: string;
  visible: boolean;
  onDismiss: () => void;
}

export default function Snackbar(props: SnackbarProps): JSX.Element {
  const { color, message, visible, onDismiss } = props;
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    snackbar: {
      zIndex: 2000,
      position: "absolute",
      left: 0,
      bottom: 10 + insets.bottom,
      backgroundColor: color,
    },
    text: {
      color: getContrastTextColor(color ?? "#000"),
    },
  });
  return (
    <PaperBar
      duration={2000}
      onDismiss={onDismiss}
      visible={visible}
      style={styles.snackbar}
    >
      <Text style={styles.text}>{message}</Text>
    </PaperBar>
  );
}
