import { Alarm } from "@devlights/types";
import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import {
    Dimensions,
    I18nManager,
    StyleSheet,
    Text,
    TouchableWithoutFeedback
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Headline, useTheme } from "react-native-paper";
import getContrastTextColor from "../textContrast";

export interface AlarmCardProps {
  alarm: Alarm;
}

export default function AlarmCard(props: AlarmCardProps): JSX.Element {
  const theme: ReactNativePaper.Theme = useTheme();
  const { alarm } = props;
  const { color, date } = alarm;
  const swipeableRef = React.useRef<Swipeable>(null);
  const getTime = () : string  => {
    let oldDate = new Date(date);
    

    return oldDate.getHours() + ":" + oldDate.getMinutes();
  }
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
      color:  getContrastTextColor(color),
    },
    touchable: {
      width: "100%",
      height: "100%",
      zIndex: 1,
    },
    animated_view: {
      flex: 1,
      backgroundColor: theme.colors.grey,
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
    },
    text: {
      color: "white",
      fontSize: 16,
      backgroundColor: "transparent",
      padding: 10,
    },
    action_container: {
      width: 80,
      flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    },
    swipeable: {
      height: 120,
      width: Dimensions.get("window").width * 0.8,
      backgroundColor: theme.colors.grey,
      marginTop: 15,
      borderRadius: 12,
    },
    button: { alignItems: "center", justifyContent: "center", flex: 1 },
  });
  return (
    <Swipeable
      ref={swipeableRef}
      containerStyle={styles.swipeable}
    >
      <TouchableWithoutFeedback style={styles.touchable} onPress={() => console.log("moin")}>
        <LinearGradient
          style={styles.card}
          colors={
            [color, color]
          }
          start={[0.25, 0.25]}
          end={[0.75, 0.75]}
        >
          <Headline style={styles.headline}>{getTime()}</Headline>
          <Text> </Text>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </Swipeable>
  );
}
