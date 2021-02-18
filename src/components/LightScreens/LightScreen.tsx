import { Light, Pattern } from "@devlights/types";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios, { AxiosError } from "axios";
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
import DropDownPicker from "react-native-dropdown-picker";
import { Divider, List, Text, useTheme } from "react-native-paper";
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
import { TagScreenNavigationProp } from "../Tags/TagScreen/TagScreen";

export type LightScreenNavigationProp = StackNavigationProp<
  LightsStackParamList,
  "light"
>;
export type LightScreenRouteProp = RouteProp<LightsStackParamList, "light">;

function PatternComponent(props: { pattern: string; id: string }): JSX.Element {
  switch (props.pattern) {
    case "gradient":
      return <GradientComponent id={props.id} />;
    case "plain":
      return <PlainComponent id={props.id} />;
    default:
      return <Text> Not implemented yet </Text>;
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
  const tags = useSelector((state: Store) => state.tags);
  const navigation = useNavigation();
  const ref = React.useRef<TextInput>();
  const snackbar = useSnackbar();
  const lights = useLight();
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [enabled, setEnabled] = React.useState<boolean>(false);
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Powerbulb id={light.id} />,
    });
  }, []);

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
    if (pattern !== light.leds.pattern) {
      const newColors: string[] = [light.leds.colors[0]];
      if (pattern === "gradient") {
        newColors.push(light.leds.colors[0]);
      }
      lights.setColor(light.id, newColors, pattern as Pattern);
    }
  };

  const addTag = (tag: string) => {
    const index = tags.findIndex(
      (t: string) => t.toLowerCase() === tag.toLowerCase(),
    );
    axios
      .put(`http://devlight/lights/${light.id}/tags`, {
        tags: [index >= 0 ? tags[index] : tag],
      })
      .then(() => {
        setEnabled(false);
        lights.fetchLight(light.id);
      })
      .catch((err: AxiosError) => {
        setEnabled(false);
        snackbar.makeSnackbar(
          err.response?.data.message ?? "an error orcurrred",
          theme.colors.error,
        );
      });
  };

  const fetch = async () => {
    setRefresh(true);
    await lights.fetchLight(route.params.id);
    setRefresh(false);
  };
  const styles = StyleSheet.create({
    container: {
      height: "100%",
      marginTop: 0,
      paddingBottom: 100
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
    item_headline: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
      fontWeight: "bold",
    },
    item_divider: { margin: theme.spacing(2) },
    list_item: { padding: theme.spacing(2) },
  });
  const newNav = useNavigation<TagScreenNavigationProp>();
  const navigateToTag = (tag: string) => {
    newNav.navigate("tag", { tag });
  };
  return (
    <KeyboardAvoidingView
      style={{ height: "100%" }}
      behavior="position"
      enabled={enabled}
      keyboardVerticalOffset={170}
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
        contentContainerStyle={{paddingBottom: theme.spacing(4)}}
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
            disabled={!light.isOn}
            items={[
              {
                label: "Single Color",
                value: "plain",
              },
              {
                label: "Gradient",
                value: "gradient",
              },
            ]}
            defaultValue={light.leds.pattern}
            containerStyle={styles.dropdownContainer}
            arrowColor={theme.colors.text}
            arrowSize={26}
            style={styles.select}
            dropDownStyle={styles.selectDropdown}
            labelStyle={styles.dropdownLabel}
            itemStyle={styles.dropdownItems}
            onChangeItem={(item) => changePattern(item.value)}
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
          <Text style={styles.item_headline}>Tags</Text>
          <Divider style={styles.item_divider} />
          {light.tags?.length > 0
            ? light.tags?.map((tag: string) => (
                <>
                  <List.Item
                    key={tag}
                    onPress={() => navigateToTag(tag)}
                    style={styles.list_item}
                    titleStyle={styles.title}
                    title={tag}
                  />
                  <Divider />
                </>
              ))
            : undefined}

          <ChangeableText
            onFocus={() => setEnabled(true)}
            /* onBlur={() => setEnabled(false)} */
            error={!enabled}
            value=""
            textAlign="left"
            placeholderTextColor={theme.colors.lightText}
            inputStyle={{
              width: "100%",
              fontSize: 14,
              fontWeight: "normal",
              color: theme.colors.text,
            }}
            editIcon={faPlus}
            onSave={addTag}
            placeholder="Add Tag"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
