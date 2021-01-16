import * as React from "react";
import { Component } from "react";
import { Snackbar as PaperBar, Text } from "react-native-paper";
import getContrastTextColor from "../../components/textContrast";

export interface SnackbarProps {
  color: string;
  message: string;
  visible: boolean;
  onDismiss: () => void;
}

export default function Snackbar(props: SnackbarProps): JSX.Element {
  const { color, message, visible, onDismiss } = props;
  return (
    <PaperBar
      duration={2000}
      onDismiss={onDismiss}
      visible={visible}
      style={{
        zIndex: 2000,
        position: "absolute",
        left: 0,
        bottom: 10,
        backgroundColor: color,
      }}
    >
      <Text style={{ color: getContrastTextColor(color ?? "#000") }}>{message}</Text>
    </PaperBar>
  );
}
