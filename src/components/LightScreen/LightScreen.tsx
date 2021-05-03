import { Light, Pattern, USER_PATTERNS } from "@devlights/types";
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
import DropDownPicker, {
  DropDownPickerProps,
} from "react-native-dropdown-picker";
import { Divider, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { LightResponse } from "../../interfaces/types";
import { LightsStackParamList } from "../../interfaces/types";
import { Store } from "../../store";
import { setLight } from "../../store/actions/lights";
import BrightnessSlider from "../BrightnessSlider";
import CountComponent from "../CountComponent";
import NameComponent from "../NameComponent";
import PatternComponent from "../PatternComponent";
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
      isEqual(l.leds, r.leds) ||
      !isEqual(l.isOn, r.isOn) ||
      isEqual(l.leds.pattern, r.leds.pattern),
  );
  const navigation = useNavigation();
  // @ts-ignore
  let dropdown = null;
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [enabled, setEnabled] = React.useState<boolean>(false);
  const [pickerOpen, setPickerOpen] = React.useState<boolean>(false);
  const defaultItems = [
    {
      label: "Single Color",
      value: "plain",
    },
    {
      label: "Gradient",
      value: "gradient",
    },
    {
      label: "Running",
      value: "runner",
    },
    {
      label: "Rainbow",
      value: "rainbow",
    },
    {
      label: "Fading",
      value: "fading",
    },
  ];
  const getRightString = (pattern?: Pattern): string => {
    switch (pattern ?? light.leds.pattern) {
      case "waking":
        return "Waking";
      case "blinking":
        return "Blinking";
      case "custom":
        return "Custom";
      default:
        return light.leds.pattern;
    }
  };

  const getDropDownItems = (
    pattern?: Pattern,
  ): DropDownPickerProps["items"] => {
    if (
      USER_PATTERNS.includes(pattern ?? light.leds.pattern) ||
      (pattern ?? light.leds.pattern === "fading")
    ) {
      return defaultItems;
    }
    return [...defaultItems, { label: getRightString(), value: "unkown" }];
  };

  const [items, setItems] = React.useState<DropDownPickerProps["items"]>(
    getDropDownItems(),
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Powerbulb ids={[light.id]} />,
    });
  }, []);

  const handlePatternChange = (pattern?: Pattern) => {
    setItems(getDropDownItems(pattern));
    dropdown.selectItem(
      [...USER_PATTERNS, "fading"].includes(pattern ?? light.leds.pattern)
        ? pattern
        : "unkown",
    );
  };

  const changePattern = async (pattern: string) => {
    if (pattern !== "unkown" && pattern !== undefined) {
      if (pattern !== light.leds.pattern) {
        const newColors: string[] = [light.leds.colors[0]];
        if (pattern === "gradient") {
          newColors.push(light.leds.colors[0]);
        }
        const ax: LightResponse = await axios.patch(`/lights/${id}/color`, {
          colors:
            pattern === "rainbow" || pattern === "fading" ? [] : newColors,
          pattern: pattern as Pattern,
          // man muss die zahl an 2 stellen ändern
          timeout: ["runner", "rainbow", "fading"].includes(pattern)
            ? 1000
            : undefined,
        });
        dispatch(setLight(light.id, ax.data.object));
        handlePatternChange(
          ax.status === 200 ? ax.data.object.leds.pattern : undefined,
        );
      }
    }
  };

  const fetch = async () => {
    setRefresh(true);
    const res: LightResponse = await axios.get(`/lights/${id}`);
    dispatch(setLight(light.id, res.data.object));
    handlePatternChange(res.data.object.leds.pattern);
    setRefresh(false);
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
      marginLeft: theme.spacing(8),
      marginRight: theme.spacing(5),
    },
    selectLabel: {
      marginLeft: 5,
    },
    select: {
      marginLeft: 0,
      backgroundColor: colors.dark_grey,
      borderColor: "transparent",
    },
    selectDropdown: {
      marginLeft: 0,
      backgroundColor: colors.grey,
      borderColor: "transparent",
    },
    title: {
      flex: 3,
      textAlignVertical: "center",
      fontSize: 20,
    },
    dropdownItems: {
      justifyContent: "flex-start",
    },
    dropdownLabel: {
      color: theme.colors.text,
      fontSize: 20,
      fontFamily: "TitilliumWeb-Regular",
      fontWeight: "normal",
    },
    dropdownContainer: {
      height: 45,
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
          <DropDownPicker
            controller={(instance: object) => (dropdown = instance)}
            disabled={!light.isOn || light.leds.pattern === "waking"}
            items={items}
            containerStyle={styles.dropdownContainer}
            arrowColor={theme.colors.text}
            arrowSize={26}
            defaultValue={
              !USER_PATTERNS.includes(light.leds.pattern) &&
              light.leds.pattern !== "fading"
                ? "unkown"
                : light.leds.pattern
            }
            style={styles.select}
            dropDownStyle={styles.selectDropdown}
            labelStyle={styles.dropdownLabel}
            itemStyle={styles.dropdownItems}
            onOpen={() => setPickerOpen(true)}
            onClose={() => setPickerOpen(false)}
            onChangeItem={(item) => {
              pickerOpen ? changePattern(item.value) : undefined;
            }}
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
