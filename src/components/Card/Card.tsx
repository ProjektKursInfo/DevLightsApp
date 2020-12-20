import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";
import { Headline, useTheme } from "react-native-paper";
import { Light } from "../../interfaces";
import getContrastTextColor from "../textContrast";

export interface CardProps {
  light: Light;
}

export default function Card(props: CardProps): JSX.Element {
  const theme: ReactNativePaper.Theme = useTheme();
  const { light } = props;
  const { colors } = light.leds;
  const styles = StyleSheet.create({
    card: {
      borderRadius: theme.roundness * 2,
      width: "80%",
      height: 120,
      marginTop: 10,
      elevation: 20,
      zIndex: 1,
    },
    headline: {
      position: "absolute",
      top: 16,
      left: 16,
      color: getContrastTextColor(colors[0]),
    },
    touchable: {
      zIndex: 1,
    },
  });

  const navigation = useNavigation();
  const onPress = (): void => {
    navigation.navigate("light", {
      id: props.light.uuid,
    });
  };
  return (
    <TouchableWithoutFeedback style={styles.touchable} onPress={onPress}>
      <LinearGradient
        style={styles.card}
        colors={[colors[0], colors[1] ?? colors[0]]}
        start={[0, 1]}
        end={[1, 0]}
      >
        <Headline style={styles.headline}>
          {light.name ?? "Name not avaible"}
        </Headline>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
export interface ActionIconProps {
  icon: IconProp;
  color: string;
  onClick(e: GestureResponderEvent): void;
}
