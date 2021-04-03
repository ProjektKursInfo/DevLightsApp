import moment from "moment";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import tinycolor from "tinycolor2";

export interface DayChipProps {
  day: number;
  selected: boolean;
  onCheckedChanged: (day: number, checked: boolean) => void;
}

const getGrey = (selected: boolean, theme: ReactNativePaper.Theme): string => {
  if (selected) {
    return tinycolor(theme.colors.primary).setAlpha(0.2).toRgbString();
  }
  if (theme.dark) {
    return theme.colors.dark_grey;
  }
  return theme.colors.grey;
};
export const DayChip = (props: DayChipProps): JSX.Element => {
  const { day, onCheckedChanged, selected } = props;
  const theme = useTheme();
  const styles = StyleSheet.create({
    root: {
      borderColor: selected
        ? tinycolor(theme.colors.primary).setAlpha(0.8).toRgbString()
        : getGrey(false, theme),
      borderRadius: 10000,
      height: Dimensions.get("window").width / 8.7,
      width: Dimensions.get("window").width / 8.7,

      borderWidth: 2,
      marginHorizontal: theme.spacing(0.5),
    },
    view: {
      padding: theme.spacing(2),
      backgroundColor: getGrey(selected, theme),
      justifyContent: "center",
    },
    text: {
      textAlign: "center",
      fontSize: 18,
    },
  });
  return (
    <TouchableRipple
      borderless
      style={styles.root}
      onPress={() => onCheckedChanged(day, !props.selected)}
    >
      <View style={styles.view}>
        <Text style={styles.text}>
          {moment().set("day", day).format("dd").substr(0, 1)}
        </Text>
      </View>
    </TouchableRipple>
  );
};
export default DayChip;
