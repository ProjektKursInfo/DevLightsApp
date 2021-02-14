import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Headline, useTheme } from "react-native-paper";
import { Light } from "@devlights/types";
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
      marginTop: theme.spacing(4),
      marginLeft: theme.spacing(4),
      color: getContrastTextColor(colors[0]),
    },
    touchable: {
      zIndex: 1,
    },
  });

  const navigation = useNavigation();
  const onPress = (): void => {
    navigation.navigate("light", {
      id: light.id,
    });
  };
  return (
    <TouchableWithoutFeedback style={styles.touchable} onPress={onPress}>
      <LinearGradient
        style={styles.card}
        colors={[colors[0], colors[1] ? colors[1] : colors[0]]}
        start={[0.25, 0.25]}
        end={[0.75, 0.75]}
      >
        <Headline style={styles.headline}>
          {light.name ?? "Name not avaible"}
        </Headline>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
