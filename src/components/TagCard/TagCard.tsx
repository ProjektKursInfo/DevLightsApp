import { Light } from "@devlights/types";
import { useNavigation } from "@react-navigation/native";
import { map } from "lodash";
import React from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Text, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import { Store } from "../../store";
import { isOnEquality } from "../../utils";
import Powerbulb from "../Powerbulb";
import { TagScreenNavigationProp } from "../Tags/TagScreen/TagScreen";
import getContrastTextColor from "../textContrast";

interface TagCardProps {
  tag: string;
}

export default function TagCard(props: TagCardProps): JSX.Element {
  const { tag } = props;
  const swipeableRef = React.useRef<Swipeable>(null);
  const lights = useSelector(
    (state: Store) => state.lights.filter((l: Light) => l.tags?.includes(tag)),
    (l: Light[], r: Light[]) => isOnEquality(l, r),
  );
  const navigation = useNavigation<TagScreenNavigationProp>();
  const theme = useTheme();
  const styles = StyleSheet.create({
    animated_view: {
      flex: 1,
      backgroundColor: theme.colors.grey,
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
    },
    action_container: {
      width: 80,
      flexDirection: "row",
    },
    swipeable: {
      height: 100,
      backgroundColor: theme.colors.grey,
      width: Dimensions.get("window").width * 0.8,
      marginTop: 15,
      borderRadius: 12,
    },
    touchable: {
      height: "100%",
      width: "100%",
      backgroundColor: theme.colors.accent,
    },
    tag: {
      color: getContrastTextColor(theme.colors.accent),
      marginLeft: theme.spacing(4),
      marginTop: theme.spacing(4),
      fontSize: 18,
    },
  });

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
          <Powerbulb
            onBulbPress={() => swipeableRef.current?.close()}
            ids={map(lights, "id")}
          />
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      containerStyle={styles.swipeable}
      renderRightActions={(progress: Animated.AnimatedInterpolation) =>
        renderRightAction(80, progress)
      }
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
