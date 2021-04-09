import { Light } from "@devlights/types";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import {
  Animated,
  Dimensions,
  I18nManager,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Headline, useTheme } from "react-native-paper";
import Powerbulb from "../Powerbulb";
import getContrastTextColor from "../textContrast";

export interface CardProps {
  light: Light;
}

export default function LightCard(props: CardProps): JSX.Element {
  const theme: ReactNativePaper.Theme = useTheme();
  const { light } = props;
  const { colors, pattern } = light.leds;
  const swipeableRef = React.useRef<Swipeable>(null);
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
      color: light.isOn
        ? pattern === "rainbow"
          ? "#fff"
          : getContrastTextColor(colors[0])
        : "#fff",
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

  const awonPress = () => {
    swipeableRef.current?.close();
  };

  const renderRightAction = (
    x: number,
    progress: Animated.AnimatedInterpolation,
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    return (
      <View style={styles.action_container}>
        <Animated.View
          style={[styles.animated_view, { transform: [{ translateX: trans }] }]}
        >
          <Powerbulb onBulbPress={awonPress} id={light.id} />
        </Animated.View>
      </View>
    );
  };

  const getRightColor = (): string[] => {
    if (light.isOn) {
      switch (light.leds.pattern) {
        case "rainbow":
        case "fading":
          return [
            "#ff0000",
            "#ffff00",
            "#00ff00",
            "#00ffff",
            "#0000ff",
            "#ff00ff",
          ];
        case "plain":
        case "runner":
        case "waking":
        case "blinking":
          return [light.leds.colors[0], light.leds.colors[0]];
        case "gradient":
          return light.leds.colors;
        default:
          return ["#000000", "#000000"];
      }
    } else {
      return ["#000000", "#000000"];
    }
  };

  const navigation = useNavigation();
  const onPress = (): void => {
    navigation.navigate("light", {
      id: light.id,
    });
  };
  return (
    <Swipeable
      ref={swipeableRef}
      containerStyle={styles.swipeable}
      renderRightActions={(progress: Animated.AnimatedInterpolation) =>
        renderRightAction(80, progress)
      }
    >
      <TouchableOpacity style={styles.touchable} onPress={onPress}>
        <LinearGradient
          style={styles.card}
          colors={getRightColor()}
          start={[0.25, 0.25]}
          end={[0.75, 0.75]}
        >
          <Headline style={styles.headline}>
            {light.name ?? "Name not avaible"}
          </Headline>
        </LinearGradient>
      </TouchableOpacity>
    </Swipeable>
  );
}
