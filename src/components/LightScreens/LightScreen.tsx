import { useRoute } from "@react-navigation/native";
import Axios from "axios";
import * as React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Divider, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Light } from "../../interfaces";
import { Store } from "../../store";
import { EDIT_LIGHT_NAME } from "../../store/actions/types";
import ChangeableText from "../ChangeableText";
import { LightScreenRouteProp } from "../Navigation/Navigation";
import PlainComponent from "../PlainComponent";

export default function LightScreen(): JSX.Element {
  const route = useRoute<LightScreenRouteProp>();
  const theme = useTheme();
  const light: Light = useSelector(
    (state: Store) => state.lights.find((l: Light) => l.uuid === route.params.id),
  ) as Light;
  const dispatch = useDispatch();

  const changeName = (name: string) => {
    Axios.patch(`http://devlight/settings/${light.uuid}`, {
      name,
    })
      .then(() => {
        dispatch({
          type: EDIT_LIGHT_NAME,
          id: light.uuid,
          name,
        });
      });
  };

  const changeNumber = (count: string) => {
    if (!/^\d+$/.test(count)) return;
    Axios.patch(`http://devlight/settings/count/${light.uuid}`, {
      count: parseInt(count, 10),
    })
      .then(() => {
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
  });
  return (
    <View style={styles.container}>
      <ChangeableText
        value={light.name}
        onSave={changeName}
        style={{ marginBottom: theme.spacing(5) }}
      />

      <View style={styles.numberContainer}>
        <Text
          style={styles.title}
        >
          LEDs
        </Text>
        <TextInput
          keyboardType="number-pad"
          onSubmitEditing={({ nativeEvent: { text } }) => changeNumber(text)}
          textAlign={"right"}
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

      <Divider style={styles.divider} />
      <View>
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
