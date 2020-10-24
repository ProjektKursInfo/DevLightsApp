import { useRoute } from "@react-navigation/native";
import Axios, { AxiosResponse } from "axios";
import * as React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Divider, Text, useTheme } from "react-native-paper";
import ChangeableText from "../ChangeableText";
import { LightScreenRouteProp } from "../Navigation/Navigation";
import PlainComponent from "../PlainComponent";

export default function LightScreen() {
  const route = useRoute<LightScreenRouteProp>();
  const theme = useTheme();
  const [name, setName] = React.useState<string>(route.params.name);
  const [pattern, setPattern] = React.useState<string>(route.params.pattern);
  const [count, setCount] = React.useState<string>(
    route.params.count.toString()
  );
  const id = route.params.id;

  const onChange = (value: string) => {
    console.log(value);
    setName(value);
  };

  const onSave = (): void => {
    if (name != route.params.name) {
      Axios.patch(`http://${ip}/settings/${id}`, {
        name: name,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  //NAME
  // PATTERN PICKER
  // PLAIN ? One Button for one color
  // GRADIENT ? Two Buttons for two colors
  const changeNumber = () => {
    let isNum: boolean = /^\d+$/.test(count);

    if (isNum) {
      Axios.patch(`http://${ip}/settings/count/${route.params.id}`, {
        count: parseInt(count),
      })
        .then((res: AxiosResponse) => {
          console.log(res);
        })
        .catch((err: unknown) => {
          console.log(err);
        });
    }
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
      marginRight: theme.spacing(5)
    },
    divider: {
      backgroundColor: theme.colors.text + "aa",
      marginVertical: 15
    },
    selectContainer: {
      marginLeft: theme.spacing(8),
      marginRight: theme.spacing(5)
    },
    selectLabel: {
      marginLeft: 5
    },
    select: {
      marginLeft: 0,
      backgroundColor: "#393939",
      borderColor: "transparent"
    },
    selectDropdown: {
      marginLeft: 0,
      backgroundColor: "#4f4f4f",
      borderColor: "transparent"
    }
  })
  return (
    <View style={styles.container}>
      <ChangeableText
        value={name}
        onChangeText={(value) => onChange(value)}
        onSave={onSave}
        style={{ marginBottom: theme.spacing(5) }}
      ></ChangeableText>

      <View
        style={styles.numberContainer}
      >
        <Text
          style={{
            flex: 3,
            textAlignVertical: "center",
            fontSize: 20,
          }}
        >
          LEDs
        </Text>
        <TextInput
          keyboardType={"number-pad"}
          onChangeText={(val) => setCount(val)}
          onSubmitEditing={() => changeNumber()}
          textAlign={"right"}
          style={{
            flex: 2,
            color: theme.colors.text,
            fontSize: 20,
            fontWeight: "bold",
          }}
          value={count}
        ></TextInput>
      </View>
      <View style={styles.selectContainer}>
        <Text style={styles.selectLabel}>Pattern</Text>
        <DropDownPicker
          items={[
            {
              label: "Single Color",
              value: "plain",
            },
            { label: "Gradient", value: "gradient" },
          ]}
          defaultValue={route.params.pattern}
          containerStyle={{ height: 45 }}
          arrowColor={theme.colors.text}
          arrowSize={26}
          style={styles.select}
          dropDownStyle={styles.selectDropdown}
          labelStyle={{ color: theme.colors.text, fontSize: 20 }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          onChangeItem={(item) => setPattern(item.value)}
        ></DropDownPicker>
      </View>

      <Divider style={styles.divider} />
      <View style={{ zIndex: 1 }}>
        {pattern === "plain" ? (
          <PlainComponent
            colors={route.params.colors}
            pattern={route.params.pattern}
            id={route.params.id}
          ></PlainComponent>
        ) : (
            <Text>Not implemented yet!</Text>
          )}
      </View>

    </View>
  );
}
