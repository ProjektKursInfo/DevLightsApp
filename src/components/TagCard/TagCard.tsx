import { Light } from "@devlights/types";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import {
  RectButton,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Text, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";
import useSnackbar from "../../hooks/useSnackbar";
import { setLight } from "../../store/actions/lights";
import { TagScreenNavigationProp } from "../Tags/TagScreen/TagScreen";

interface TagCardProps {
  tag: string;
}

export default function TagCard(props: TagCardProps): JSX.Element {
  const { tag } = props;
  const navigation = useNavigation<TagScreenNavigationProp>();
  const theme = useTheme();
  const styles = StyleSheet.create({
    animated_view: { flex: 1, backgroundColor: "red" },
    button: { alignItems: "center", justifyContent: "center", flex: 1 },
    text: {
      color: "white",
      fontSize: 16,
      backgroundColor: "transparent",
      padding: 10,
    },
    action_container: {
      width: 128,
      flexDirection: "row",
    },
    swipeable: {
      height: 100,
      width: Dimensions.get("window").width * 0.8,
      backgroundColor: theme.colors.lightText,
      marginTop: 15,
      borderRadius: 12,
    },
    touchable: { height: "100%", width: "100%" },
    tag: {
      marginLeft: theme.spacing(4),
      marginTop: theme.spacing(4),
      fontSize: 18,
    },
  });
  const dispatch = useDispatch();
  const snackbar = useSnackbar();

  const onPress = (type: string) => {
    axios
      .patch(`/tags/${tag}/${type}`)
      .then((res) => {
        snackbar.makeSnackbar(res.data.message, theme.colors.success);
        const newLights: Light[] = res.data.object as Light[];
        newLights.map((l: Light) => dispatch(setLight(l.id, l)));
      })
      .catch((err) => {
        snackbar.makeSnackbar(
          err.response.data.message ?? `Maybe all Lights are already ${type}?`,
          theme.colors.error,
        );
      });
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
          onPress={() => onPress(type)}
        >
          <Text style={styles.text}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };
  const renderRightActions = (progress: Animated.AnimatedInterpolation) => (
    <View style={styles.action_container}>
      {renderRightAction("All on", theme.colors.grey, 128, progress, "on")}
      {renderRightAction("All off", theme.colors.error, 64, progress, "off")}
    </View>
  );

  return (
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
    </Swipeable>
  );
}
