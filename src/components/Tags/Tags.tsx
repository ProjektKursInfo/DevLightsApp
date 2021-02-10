import { useNavigation } from "@react-navigation/native";
import axios, { AxiosResponse } from "axios";
import React from "react";
import {
  Animated,
  Dimensions,
  I18nManager,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import {
  RectButton,
  TouchableWithoutFeedback
} from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Title, useTheme, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import Lottie from "lottie-react-native";
import useSnackbar from "../../hooks/useSnackbar";
import Light from "@bit/devlights.types.lightinterface";
import { Store } from "../../store";
import { setLight } from "../../store/actions/lights";
import { setTags } from "../../store/actions/tags";
import { tagArrayEquality } from "../../utils";
import { TagScreenNavigationProp } from "../Navigation/TagsNavigator";

interface TagCardProps {
  tag: string;
}

function TagCard(props: TagCardProps) {
  const { tag } = props;
  const navigation = useNavigation<TagScreenNavigationProp>();
  const theme = useTheme();
  const styles = StyleSheet.create({
    animated_view: { flex: 1 },
    button: { alignItems: "center", justifyContent: "center", flex: 1 },
    text: {
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
      .patch(`http://devlight/tags/${tag}/${type}`)
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
      {renderRightAction("All on", theme.colors.success, 128, progress, "on")}
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

function Tags(): JSX.Element {
  const tags = useSelector(
    (state: Store) => state.tags,
    (l: string[], r: string[]) => tagArrayEquality(l, r),
  );
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const dispatch = useDispatch();

  const fetch = (refreshing = false) => {
    if (refreshing) setRefresh(true);
    axios.get("http://devlight/tags").then((res: AxiosResponse) => {
      dispatch(setTags(res.data.object));
      if (refreshing) setRefresh(false);
    });
  };

  const styles = StyleSheet.create({
    container: { width: "100%", height: "100%" },
    contentContainerStyle: { alignItems: "center" },
    title: {
      paddingTop: 30,
      marginBottom: 10,
      fontSize: 40,
    },
    error_text: {
      textAlign: "center",
      fontSize: 16,
    },
  });
  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={() => fetch(true)} />
        }
        contentContainerStyle={styles.contentContainerStyle}
      >
        <Title style={styles.title}>Tags</Title>
        {tags.length === 0 ? (
          <>
            <Lottie
              duration={4000}
              autoPlay
              hardwareAccelerationAndroid
              loop={false}
              autoSize
              // eslint-disable-next-line global-require
              source={require("../../../assets/animations/bulb.json")}
            />
            <Text style={styles.error_text}>
              Sorry! There aren`t any tags yet.
            </Text>
          </>
        ) : (
          tags.map((tag: string) => <TagCard key={tag} tag={tag} />)
        )}
      </ScrollView>
    </View>
  );
}

export default Tags;
