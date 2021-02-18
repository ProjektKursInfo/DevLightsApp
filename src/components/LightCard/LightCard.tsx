import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { Animated, Dimensions, I18nManager, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Headline, useTheme, Text } from "react-native-paper";
import { Light } from "@devlights/types";
import getContrastTextColor from "../textContrast";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RectButton } from "react-native-gesture-handler";
import axios from "axios";
import useLight from "../../hooks/useLight";

export interface CardProps {
  light: Light;
}

export default function LightCard(props: CardProps): JSX.Element {
  const theme: ReactNativePaper.Theme = useTheme();
  const { light } = props;
  const { colors } = light.leds;
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
      color: getContrastTextColor(colors[0]),
    },
    touchable: {
      width: "100%",
      height: "100%",
      zIndex: 1,
    },
    animated_view: { flex: 1, backgroundColor: "red" },
    text:  {
      color: "white",
      fontSize: 16,
      backgroundColor: "transparent",
      padding: 10,
    },
    action_container: {
      width: 128,
      flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    },
    swipeable: {
      height: 120,
      width: Dimensions.get("window").width * 0.8,
      backgroundColor: theme.colors.lightText,
      marginTop: 15,
      borderRadius: 12,
    },
    button: { alignItems: "center", justifyContent: "center", flex: 1 },
  });
  const lights = useLight();

  const actionPress = (type: string) => {
     lights.setStatus(props.light.id, type === "on" ? true : false);
      console.log("moin");
  };

  const renderRightAction = (
    text: string,
    color: string,
    x: number,
    progress: Animated.AnimatedInterpolation,
    type: string,
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    return (
      <Animated.View
        style={[styles.animated_view, { transform: [{ translateX: trans }] }]}
      >
        <RectButton
          style={[
            styles.button,
            {
              backgroundColor: color,
            },
          ]}
          onPress={() => actionPress(type)}
        >
          <Text style={styles.text}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };
  const renderRightActions = (progress: Animated.AnimatedInterpolation) => (
    <View style={styles.action_container}>
      {renderRightAction("On", theme.colors.success, 128, progress, "on")}
      {renderRightAction("Off", theme.colors.error, 64, progress, "off")}
    </View>
  );

  const navigation = useNavigation();
  const onPress = (): void => {
    navigation.navigate("light", {
      id: light.id,
    });
  };
  return (

    /**
    <Swipeable
      containerStyle={styles.swipeable}
      renderRightActions={renderRightActions}
    >
      <TouchableWithoutFeedback
        style={styles.touchable}
        onPress={() => navigation.navigate("tag", { tag })}
      >
        <Text style={styles.tag}>{tag}</Text>
      </TouchableWithoutFeedback>
    </Swipeable> */
   <Swipeable  containerStyle={styles.swipeable} renderRightActions={renderRightActions}> 
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
  </Swipeable>
  );
}
