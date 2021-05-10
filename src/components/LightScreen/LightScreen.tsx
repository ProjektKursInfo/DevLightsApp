import { Light, Pattern } from "@devlights/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import { isEqual } from "lodash";
import * as React from "react";
import {
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { LightResponse, LightsStackParamList } from "../../interfaces/types";
import { Store } from "../../store";
import { setLight } from "../../store/actions/lights";
import BrightnessSlider from "../BrightnessSlider";
import CountComponent from "../CountComponent";
import NameComponent from "../NameComponent";
import PatternComponent from "../PatternComponent";
import PatternPicker from "../PatternPicker";
import Powerbulb from "../Powerbulb";
import TagsList from "../TagsList/TagsList";

export type LightScreenNavigationProp = StackNavigationProp<
  LightsStackParamList,
  "light"
>;
export type LightScreenRouteProp = RouteProp<LightsStackParamList, "light">;

export default function LightScreen(): JSX.Element {
  const route = useRoute<LightScreenRouteProp>();
  const { params } = route;
  const { id } = params;
  const theme = useTheme();
  const { colors } = theme;
  const dispatch = useDispatch();
  const light = useSelector(
    (state: Store) => state.lights.find((l: Light) => l.id === id) as Light,
    (l: Light, r: Light) =>
      isEqual(l.isOn, r.isOn) &&
      isEqual(l.leds.colors, r.leds.colors) &&
      isEqual(l.leds.pattern, r.leds.pattern),
  );
  const navigation = useNavigation();

  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [enabled, setEnabled] = React.useState<boolean>(false);
  const [pickerOpen, setPickerOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Powerbulb ids={[light.id]} />,
    });
  }, []);

  const fetch = async () => {
    setRefresh(true);
    const res: LightResponse = await axios.get(`/lights/${id}`);
    dispatch(setLight(light.id, res.data.object));
    setRefresh(false);
  };

  const changePattern = async (newPattern: Pattern): Promise<Pattern> => {
    const newColors: string[] = [light.leds.colors[0]];
    if (newPattern === "gradient") {
      newColors.push(light.leds.colors[0]);
    }
    const ax: LightResponse = await axios.patch(`/lights/${id}/color`, {
      colors:
        newPattern === "rainbow" || newPattern === "fading" ? [] : newColors,
      pattern: newPattern as Pattern,
      // man muss die zahl an 2 stellen ändern
      timeout: ["runner", "rainbow", "fading"].includes(newPattern)
        ? 1000
        : undefined,
    });
    if (ax.status === 200) {
      dispatch(setLight(light.id, ax.data.object));
      return newPattern;
    }
    return light.leds.pattern;
  };

  const styles = StyleSheet.create({
    container: {
      height: "100%",
      marginTop: 0,
      paddingBottom: 100,
    },
    numberContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: theme.spacing(4),
      marginLeft: theme.spacing(8),
      marginRight: theme.spacing(5),
    },
    divider: {
      backgroundColor: `${theme.colors.text}aa`,
      marginVertical: 15,
    },
    selectContainer: {
      marginLeft: theme.spacing(7),
      marginRight: theme.spacing(5),
    },
    selectLabel: {
      marginLeft: 5,
    },
    title: {
      flex: 3,
      textAlignVertical: "center",
      fontSize: 20,
    },

    pattern: { zIndex: -1 },
    slider_container: {
      marginTop: 10,
      marginLeft: theme.spacing(6),
      marginRight: theme.spacing(6),
    },
    slider_text: {
      fontSize: 20,
      fontFamily: "TitilliumWeb-Regular",
    },
    item_container: {
      marginTop: theme.spacing(3),
      borderRadius: 12,
      backgroundColor: theme.colors.grey,
      width: "90%",
      alignSelf: "center",
    },
  });
  return (
    <KeyboardAvoidingView
      style={{ height: "100%" }}
      behavior="height"
      enabled={enabled}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={fetch}
            tintColor={colors.accent}
            colors={[colors.primary, colors.accent]}
          />
        }
        style={styles.container}
        contentContainerStyle={{ paddingBottom: theme.spacing(4) }}
      >
        <NameComponent light={light} />

        <View style={styles.numberContainer}>
          <Text style={styles.title}>LEDs</Text>
          <CountComponent light={light} />
        </View>
        <View style={styles.selectContainer}>
          <Text style={styles.selectLabel}>Pattern</Text>
          <PatternPicker
            disabled={!light.isOn || light.leds.pattern === "waking"}
            pattern={light.leds.pattern}
            pickerOpen={pickerOpen}
            onOpen={() => setPickerOpen(true)}
            onClose={() => setPickerOpen(false)}
            changePattern={(pattern: Pattern) => changePattern(pattern)}
          />
        </View>

        <View style={styles.slider_container}>
          <Text style={styles.slider_text}> Brightness</Text>
          <BrightnessSlider color={light.leds.colors[0]} ids={[light.id]} />
        </View>

        <Divider style={styles.divider} />
        <View style={styles.pattern}>
          <PatternComponent id={light.id} />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.item_container}>
          <TagsList enabled={enabled} setEnabled={setEnabled} light={light} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
