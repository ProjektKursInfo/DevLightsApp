import { Alarm } from "@devlights/types";
import * as React from "react";
import {
  Dimensions,
  I18nManager,
  StyleSheet,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { List, useTheme } from "react-native-paper";
import getContrastTextColor from "../textContrast";

export interface AlarmCardProps {
  alarm: Alarm;
}

export default function AlarmCard(props: AlarmCardProps): JSX.Element {
  const theme: ReactNativePaper.Theme = useTheme();
  const { alarm } = props;
  const { color, date } = alarm;
  const swipeableRef = React.useRef<Swipeable>(null);
  const getTime = (): string => {
    const oldDate = new Date(date);
    return `${oldDate.getHours()}:${oldDate.getMinutes()}`;
  };
  const styles = StyleSheet.create({
    card: {
      width: "100%",
      height: "100%",
      elevation: 20,
      zIndex: 1,
    },
    headline: {
      marginTop: theme.spacing(4),
      marginLeft: theme.spacing(4),
      color: getContrastTextColor(color),
    },
    touchable: {
      width: "100%",
      height: "100%",
      zIndex: 1,
    },
    animated_view: {
      flex: 1,
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
    },
    text: {
      color: theme.colors.lightText,
      fontSize: 16,
      backgroundColor: "transparent",
      padding: 5,
    },
    title: {
      color: theme.colors.text,
      fontSize: 20,
      padding: 5,
    },
    action_container: {
      width: 80,
      flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    },
    swipeable: {
      height: 80,
      width: Dimensions.get("window").width,
      marginTop: 15,
      borderRadius: 12,
    },
    button: { alignItems: "center", justifyContent: "center", flex: 1 },
  });
  return (
    <Swipeable ref={swipeableRef} containerStyle={styles.swipeable}>
      <List.Item
        title={getTime()}
        titleStyle={styles.title}
        description={alarm.date}
        descriptionStyle={styles.text}
      />
    </Swipeable>
  );
}
