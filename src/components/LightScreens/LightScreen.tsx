import { Light, Pattern, USER_PATTERNS } from "@devlights/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { isEqual } from "lodash";
import * as React from "react";
import {
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import DropDownPicker, {
  DropDownPickerProps,
} from "react-native-dropdown-picker";
import { Divider, Text, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import useLight from "../../hooks/useLight";
import useSnackbar from "../../hooks/useSnackbar/useSnackbar";
import { LightsStackParamList } from "../../interfaces/types";
import { Store } from "../../store";
import BrightnessSlider from "../BrightnessSlider";
import ChangeableText from "../ChangeableText";
import GradientComponent from "../GradientComponent";
import PlainComponent from "../PlainComponent";
import Powerbulb from "../Powerbulb";
import RainbowComponent from "../RainbowComponent";
import RunnerComponent from "../RunnerComponent";
import TagsList from "../TagsList/TagsList";

export type LightScreenNavigationProp = StackNavigationProp<
  LightsStackParamList,
  "light"
>;
export type LightScreenRouteProp = RouteProp<LightsStackParamList, "light">;

function PatternComponent(props: {
  pattern: Pattern;
  id: string;
}): JSX.Element {
  switch (props.pattern) {
    case "gradient":
      return <GradientComponent id={props.id} />;
    case "plain":
      return <PlainComponent id={props.id} />;
    case "runner":
      return <RunnerComponent id={props.id} />;
    case "rainbow":
      return <RainbowComponent id={props.id} />;
    default:
      return (
        <Text style={{ textAlign: "center" }}>
          The Light is currently in a mode where changing the Color is not
          supported.
        </Text>
      );
  }
}

export default function LightScreen(): JSX.Element {
  const route = useRoute<LightScreenRouteProp>();
  const theme = useTheme();
  const { colors } = theme;
  const light = useSelector(
    (state: Store) =>
      state.lights.find((l: Light) => l.id === route.params.id) as Light,
    (l: Light, r: Light) =>
      !isEqual(l.leds, r.leds) || !isEqual(l.isOn, r.isOn),
  );
  const navigation = useNavigation();
  const ref = React.useRef<TextInput>();
  const snackbar = useSnackbar();
  const lights = useLight();
  // @ts-ignore
  let dropdown = null;
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
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
  ];
  const getRightString = (pattern?: Pattern): string => {
    switch (pattern ?? light.leds.pattern) {
      case "rainbow":
        return "Rainbow";
      case "waking":
        return "Waking";
      case "fading":
        return "Fading";
      case "blinking":
        return "Blinking";
      case "custom":
        return "Custom";
      default:
        return light.leds.pattern;
    }
  };

  const [items, setItems] = React.useState<DropDownPickerProps["items"]>(
    USER_PATTERNS.includes(light.leds.pattern)
      ? defaultItems
      : [
        ...defaultItems,
        {
          label: getRightString(),
          value: "unkown",
        },
      ],
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Powerbulb id={light.id} />,
    });
  }, []);


  const handlePatternChange = (pattern?: Pattern) => {
    console.log(pattern);
    console.log(getRightString());
    if (!USER_PATTERNS.includes(pattern ?? light.leds.pattern)) {
      setItems([...defaultItems, { label: getRightString(pattern), value: "unkown" }]);
      // @ts-ignore
      dropdown.selectItem("unkown");
    } else {
      // @ts-ignore
      dropdown.selectItem(light.leds.pattern);
    }
  };

  const changeName = (name: string) => {
    const ax = lights.setName(light.id, name);
    ax.then(() => {
      setError(false);
    });
    ax.catch(() => {
      setError(true);
    });
  };

  const changeLedCount = (count: string) => {
    if (!/^\d+$/.test(count) || parseInt(count, 10) > 150) {
      snackbar.makeSnackbar("Invalid number or string provided!", colors.error);
      if (ref) {
        ref.current?.setNativeProps({ text: light.count.toString() });
      }
      return;
    }
    lights.setCount(light.id, parseInt(count, 10));
  };
  const changePattern = (pattern: string) => {
    if (pattern !== "unkown" && pattern !== undefined) {
      if (pattern !== light.leds.pattern) {
        const newColors: string[] = [light.leds.colors[0]];
        if (pattern === "gradient") {
          newColors.push(light.leds.colors[0]);
        }
        lights.setColor(
          light.id,
          // replace with one parameter of type Partial<Leds>
          pattern === "rainbow" ? [] : newColors,
          pattern as Pattern,
          // man muss die zahl an 2 stellen ändern
          pattern === "runner" || pattern === "rainbow" ? 1000 : undefined,
        ).catch(() => {
          handlePatternChange();
        });
      }
    }
  };

  const fetch = async () => {
    setRefresh(true);
    const res = await lights.fetchLight(route.params.id);
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
    textinput: {
      flex: 2,
      color: theme.colors.text,
      fontSize: 20,
      fontFamily: "TitilliumWeb-Bold",
      fontWeight: "600",
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
    plain: { zIndex: -1 },
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
        <ChangeableText
          error={error}
          value={light.name}
          onSave={changeName}
          style={{ marginBottom: theme.spacing(5) }}
        />

        <View style={styles.numberContainer}>
          <Text style={styles.title}>LEDs</Text>
          <TextInput
            editable={light.isOn}
            ref={ref as React.RefObject<TextInput>}
            keyboardType="number-pad"
            onSubmitEditing={({ nativeEvent: { text } }) =>
              changeLedCount(text)
            }
            textAlign="right"
            style={styles.textinput}
            defaultValue={light.count.toString()}
          />
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
              !USER_PATTERNS.includes(light.leds.pattern)
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
          <BrightnessSlider color={light.leds.colors[0]} id={light.id} />
        </View>

        <Divider style={styles.divider} />
        <View style={styles.plain}>
          <PatternComponent pattern={light.leds.pattern} id={light.id} />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.item_container}>
          <TagsList enabled={enabled} setEnabled={setEnabled} light={light} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
