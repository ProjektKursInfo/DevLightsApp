import { isEqual } from "lodash";
import React from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { Button, Dialog, Portal, RadioButton } from "react-native-paper";
import { useSelector } from "react-redux";
import { ThemeType } from "../../interfaces/types";
import { Store } from "../../store";
import { useThemeChange } from "./ThemeProvider";

export interface ThemeDialogProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function ThemeDialog(props: ThemeDialogProps): JSX.Element {
  const { visible } = props;
  const theme = useSelector(
    (state: Store) => state.theme,
    (l: ThemeType, r: ThemeType) => isEqual(l, r),
  );
  const [value, setValue] = React.useState<ThemeType>(theme);
  const changeTheme = useThemeChange();

  const onConfirm = async () => {
    changeTheme.changeTheme(value);
    props.onDismiss();
  };

  const onDismiss = async () => {
    props.onDismiss();
    setValue(theme);
  };

  const styles = StyleSheet.create({
    radioItem: {
      flexDirection: "row-reverse",
      alignSelf: "flex-start",
    },
  });

  const getTextStyle = (pValue: string): StyleProp<TextStyle> => {
    const fontWeight = value === pValue ? "bold" : "normal";
    return {
      fontWeight,
    };
  };
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} dismissable>
        <Dialog.Title>Choose Theme</Dialog.Title>
        <Dialog.Content>
          <RadioButton.Group
            onValueChange={(newValue: string) => {
              setValue(newValue as ThemeType);
            }}
            value={value}
          >
            <RadioButton.Item
              style={styles.radioItem}
              labelStyle={getTextStyle("light")}
              label="Light Theme"
              value="Light"
            />
            <RadioButton.Item
              style={styles.radioItem}
              labelStyle={getTextStyle("dark")}
              label="Dark Theme"
              value="Dark"
            />
            <RadioButton.Item
              style={styles.radioItem}
              labelStyle={getTextStyle("system-default")}
              label="System-Default"
              value="System-Default"
            />
          </RadioButton.Group>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={onConfirm}>Save</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
