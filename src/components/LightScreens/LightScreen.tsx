import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faLightbulb as regular } from "@fortawesome/free-regular-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import Axios, { AxiosError, AxiosResponse } from "axios";
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
import { Light } from "../../interfaces";
import { Store } from "../../store";
import {
  EDIT_LED_COUNT,
  EDIT_LIGHT_COLOR,
  EDIT_LIGHT_NAME,
  SET_LIGHT,
  SET_LIGHT_STATUS,
} from "../../store/actions/types";
import BrightnessSlider from "../BrightnessSlider";
import ChangeableText from "../ChangeableText";
import GradientComponent from "../GradientComponent";
import { LightScreenRouteProp } from "../Navigation/Navigation";
import PlainComponent from "../PlainComponent";
import useSnackbar from "../../hooks/useSnackbar/useSnackbar";
import useLight from "../../hooks/useLight";

function PatternComponent(props: {pattern: string, id: string}) : JSX.Element {
  console.log(props.pattern);
  const {pattern, id} = props;
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
  const dispatch = useDispatch();
  const theme = useTheme();
  const snackbar = useSnackbar();
  const [icon, setIcon] = React.useState<IconDefinition>(
    light.isOn ? faLightbulb : regular
  );
  const onPress = () => {
    Axios.patch(
      `http://devlight/lights/${light.uuid}/${light.isOn ? "off" : "on"}`,
    ).then((response: AxiosResponse) => {
      setIcon(light.isOn ? regular : faLightbulb);
      snackbar.makeSnackbar(response.data.message, theme.colors.accent);
      dispatch({
        type: SET_LIGHT_STATUS,
        id: light.uuid,
        isOn: !light.isOn,
      });
    });
  };
  const styles = StyleSheet.create({
    pressable: { marginRight: 30, marginTop: 15, alignSelf: "center" },
  });
  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <FontAwesomeIcon
        size={30}
        {...props}
        color={theme.colors.accent}
        icon={icon}
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
      state.lights.find((l: Light) => l.uuid === route.params.id) as Light,
    (left: Light, right: Light) => !isEqual(left.leds, right.leds)
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const ref = React.useRef<TextInput>();
  const snackbar = useSnackbar();
  const lights = useLight();
  const [refresh, setRefresh] = React.useState<boolean>(false);
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => <PowerBulb light={light} />,
    });
  }, []);

  const changeName = (name: string) => {
    lights.setName(light.uuid, name);
  };

  const changeNumber = (count: string) => {
    if (!/^\d+$/.test(count)) return;
    const response = lights.setCount(light.uuid, parseInt(count, 10));
    response.catch((err: AxiosError) => {
      if (ref) {
        ref.current?.setNativeProps({ text: light.count.toString() });
      }
      if (err?.response?.data.message) {
        snackbar.makeSnackbar(err.response.data.message, "#f00");
      }
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const changePattern = (pattern: string) => {
    if (pattern !== light.leds.pattern) {
      const colors: string[] = [light.leds.colors[0]];
      if (pattern === "gradient") {
        colors.push(light.leds.colors[0]);
      }
      console.log(pattern);
      lights.setColor(light.uuid, colors, pattern);
    }
  };

  const fetch = () => {
    setRefresh(true);
    Axios.get(`http://devlight/lights/${route.params.id}`).then((response) => {
      dispatch({
        type: SET_LIGHT,
        id: route.params.id,
        light: response.data.object,
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
      backgroundColor: "#393939",
      borderColor: "transparent",
    },
    selectDropdown: {
      marginLeft: 0,
      backgroundColor: "#4f4f4f",
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
      refreshControl={(
        <RefreshControl
          refreshing={refresh}
          onRefresh={fetch}
          tintColor={colors.accent}
          colors={[colors.primary, colors.accent]}
        />
      )}
      style={styles.container}
    >
      <ChangeableText
        value={light.name}
        onSave={changeName}
        style={{ marginBottom: theme.spacing(5) }}
      />

      <View style={styles.numberContainer}>
        <Text style={styles.title}>LEDs</Text>
        <TextInput
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
          onChangeItem={(item) => (
            changePattern(item.value)
          )}
        />
      </View>

      <View style={styles.slider_container}>
        <Text style={styles.slider_text}> Brightness</Text>
        <BrightnessSlider color={light.leds.colors[0]} id={light.uuid} />
      </View>

      <Divider style={styles.divider} />
      <View style={styles.plain}>
        <PatternComponent pattern={light.leds.pattern} id={light.uuid} />
      </View>
    </ScrollView>
  );
}
