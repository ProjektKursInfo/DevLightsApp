import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faLightbulb as regular } from "@fortawesome/free-regular-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import Axios from "axios";
import * as React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Divider, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Light } from "../../interfaces";
import { Store } from "../../store";
import { EDIT_LIGHT_NAME, SET_LIGHT_STATUS } from "../../store/actions/types";
import BrightnessSlider from "../BrightnessSlider";
import ChangeableText from "../ChangeableText";
import { LightScreenRouteProp } from "../Navigation/Navigation";
import PlainComponent from "../PlainComponent";

interface PowerBulbProps{
  light: Light
}
export function PowerBulb(props: PowerBulbProps): JSX.Element {
  const {light} = props;
  const dispatch = useDispatch();
  const theme = useTheme();
  const [icon, setIcon] = React.useState<IconDefinition>(light.isOn ? faLightbulb : regular);
  const onPress = () => {
    Axios.patch(`http://devlight/${light.uuid}/${light.isOn ? "off" : "on"}`)
      .then(() => {
        setIcon(light.isOn ? regular : faLightbulb);
        dispatch({
          type: SET_LIGHT_STATUS,
          id: light.uuid,
          isOn: !light.isOn,
        });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const styles = StyleSheet.create({
    pressable: { marginRight: 30, marginTop: 15, alignSelf: "center" },
  });
  return (
    <Pressable
      onPress={onPress}
      style={styles.pressable}
    >
      <FontAwesomeIcon size={30} {...props} color={theme.colors.accent} icon={icon} />
    </Pressable>
  );
}
export default function LightScreen(): JSX.Element {
  const route = useRoute<LightScreenRouteProp>();
  const theme = useTheme();
  const light: Light = useSelector((state: Store) => (
    state.lights.find((l: Light) => l.uuid === route.params.id)
  )) as Light;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <PowerBulb light={light} />
      ),
    });
  }, []);

  const changeName = (name: string) => {
    Axios.patch(`http://devlight/${light.uuid}`, {
      name,
    }).then(() => {
      dispatch({
        type: EDIT_LIGHT_NAME,
        id: light.uuid,
        name,
      });
    });
  };
  const changeNumber = (count: string) => {
    if (!/^\d+$/.test(count)) return;
    Axios.patch(`http://devlight/count/${light.uuid}`, {
      count: parseInt(count, 10),
    }).then(() => {
      dispatch({
        type: "EDIT_LED_COUNT",
        id: light.uuid,
        count: parseInt(count, 10),
      });
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const changePattern = (pattern: string) => {
    // change pattern
    // TODO does nothing till implemented on server
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
      zIndex: 10,
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
      zIndex: 10,
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
      zIndex: 10,
    },
    plain: { zIndex: -1 },
    slider_container: {
      marginTop: theme.spacing(4),
      marginLeft: theme.spacing(7),
    },
    slider_text: {
      fontSize: 20,
      fontFamily: "TitilliumWeb-Regular",
    }
  });
  return (
    <View style={styles.container}>
      <ChangeableText
        value={light.name}
        onSave={changeName}
        style={{ marginBottom: theme.spacing(5) }}
      />

      <View style={styles.numberContainer}>
        <Text style={styles.title}>LEDs</Text>
        <TextInput
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
            /* { label: "Gradient", value: "gradient" }, */
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
        <BrightnessSlider light={light} />
      </View>  

      <Divider style={styles.divider} />
      <View style={styles.plain}>
        {light.leds.pattern === "plain" ? (
          <PlainComponent
            colors={light.leds.colors}
            pattern={light.leds.pattern}
            id={light.uuid}
          />
        ) : (
          <Text>Not implemented yet!</Text>
        )}
      </View>
      
    </View>
  );
}
