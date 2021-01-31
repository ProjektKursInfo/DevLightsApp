import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faLightbulb as regular } from "@fortawesome/free-regular-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import Axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { isEqual } from "lodash";
import * as React from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Divider, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import useLight from "../../hooks/useLight";
import useSnackbar from "../../hooks/useSnackbar/useSnackbar";
import { Light } from "../../interfaces";
import { Pattern } from "../../interfaces/types";
import { Store } from "../../store";
import { setLight } from "../../store/actions/lights";
import BrightnessSlider from "../BrightnessSlider";
import ChangeableText from "../ChangeableText";
import GradientComponent from "../GradientComponent";
import { LightScreenRouteProp } from "../Navigation/Navigation";
import PlainComponent from "../PlainComponent";
import { Text as SvgText, TSpan } from "react-native-svg";

function PatternComponent(props: { pattern: string; id: string }): JSX.Element {
  const { pattern, id } = props;
  switch (pattern) {
    case "gradient":
      return <GradientComponent id={id} />;
    case "plain":
      return <PlainComponent id={id} />;
    default:
      return <Text> Not implemented yet </Text>;
  }
}

interface PowerBulbProps {
  light: Light;
}
export function PowerBulb(props: PowerBulbProps): JSX.Element {
  const { light } = props;
  const theme = useTheme();
  const lights = useLight();
  const [icon, setIcon] = React.useState<IconDefinition>(
    light.isOn ? faLightbulb : regular
  );
  const styles = StyleSheet.create({
    pressable: { marginRight: 30, marginTop: 15, alignSelf: "center" },
  });
  return (
    <Pressable
      onPress={() => {
        lights.setStatus(light.id, !light.isOn);
        setIcon(light.isOn ? regular : faLightbulb);
      }}
      style={styles.pressable}
    >
      <FontAwesomeIcon
        size={30}
        color={theme.colors.accent}
        icon={icon}
        {...props}
      />
    </Pressable>
  );
}
export default function LightScreen(): JSX.Element {
  const route = useRoute<LightScreenRouteProp>();
  const theme = useTheme();
  const { colors } = theme;
  const light = useSelector(
    (state: Store) =>
      state.lights.find((l: Light) => l.id === route.params.id) as Light,
    (left: Light, right: Light) =>
      !isEqual(left.leds, right.leds) || !isEqual(left.isOn, right.isOn)
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const ref = React.useRef<TextInput>();
  const snackbar = useSnackbar();
  const lights = useLight();
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  React.useEffect(() => {
    setError(false);
    navigation.setOptions({
      headerRight: () => <PowerBulb light={light} />,
    });
  }, []);

  const changeName = (name: string) => {
    const ax = lights.setName(light.id, name);
    ax.then(() => setError(false));
    ax.catch(() => {
      setError(true);
    });
  };

  const changeNumber = (count: string) => {
    if (!/^\d+$/.test(count)) {
      snackbar.makeSnackbar("Invalid number or string provided", colors.error);
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

  const fetch = () => {
    setRefresh(true);
    Axios.get(`http://devlight/lights/${route.params.id}`).then((response) => {
      dispatch(setLight(route.params.id, response.data.object));
      navigation.setOptions({
        headerRight: () => <PowerBulb light={response.data.object} />,
      });
      setRefresh(false);
    });
  };
  const styles = StyleSheet.create({
    container: {
      marginTop: 30,
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
  });
  return (
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
          ref={ref}
          keyboardType="number-pad"
          onSubmitEditing={({ nativeEvent: { text } }) => changeNumber(text)}
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
      <SvgText fill="url(#rainbow)">
        <TSpan fontSize="72" x="0" y="72">
          gradient
        </TSpan>
      </SvgText>
    </ScrollView>
  );
}
