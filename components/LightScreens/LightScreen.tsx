import { useRoute } from "@react-navigation/native";
import Axios, { AxiosResponse } from "axios";
import * as React from "react";
import { Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useTheme } from "react-native-paper";
import PlainComponent from "../PlainComponent";
import ChangeableText from "../ChangeableText";
import { LightScreenRouteProp } from "../Navigation/Navigation";

export default function LightScreen() {
  const route = useRoute<LightScreenRouteProp>();
  const { colors } = useTheme();
  const [name, setName] = React.useState<string>(route.params.name);
  const [pattern, setPattern] = React.useState<string>(route.params.pattern);
  const [editable, setEditable] = React.useState<boolean>(false);
  const [count, setCount] = React.useState<string>(
    route.params.count.toString()
  );
  const id = route.params.id;

  const onChange = (value: string) => {
    console.log(value);
    setName(value);
  };

  const onEditPress = (): void => {
    console.log("press");
    setEditable(true);
  };

  const onSave = (): void => {
    setEditable(false);
    saveName();
  };

  const saveName = (): void => {
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
  return (
    <View>
      <ChangeableText
        value={name}
        onChangeText={(value) => onChange(value)}
        editable={editable}
        onSave={onSave}
        onEditPress={onEditPress}
      ></ChangeableText>
      <View style={{ marginTop: 40 }}>
        <DropDownPicker
          items={[
            {
              label: "One Color",
              value: "plain",
            },
            { label: "Two colors, like a gradient", value: "gradient" },
          ]}
          defaultValue={route.params.pattern}
          containerStyle={{ height: 40 }}
          arrowColor={colors.text}
          style={{
            width: "80%",
            alignSelf: "center",
            backgroundColor: colors.background,
            borderColor: colors.background,
          }}
          dropDownStyle={{
            width: "80%",
            alignSelf: "center",
            backgroundColor: "#4f4f4f",
            borderColor: "#4f4f4f",
            zIndex: 2000,
          }}
          labelStyle={{ color: colors.text, fontSize: 20 }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          onChangeItem={(item) => setPattern(item.value)}
        ></DropDownPicker>
        <View style={{ zIndex: 1 }}>
          {pattern === "plain" ? (
            <PlainComponent
              colors={route.params.colors}
              pattern={route.params.pattern}
              id={route.params.id}
            ></PlainComponent>
          ) : (
            <> </>
          )}
        </View>
        <View
          style={{ flexDirection: "row", marginTop: 15, alignSelf: "center" }}
        >
          <Text
            style={{
              flex: 3,
              textAlignVertical: "center",
              color: colors.text,
              fontSize: 20,
              textAlign: "center",
            }}
          >
            {" "}
            Number of the LEDs:
          </Text>
          <TextInput
            keyboardType={"number-pad"}
            textAlign="center"
            onChangeText={(val) => setCount(val)}
            onSubmitEditing={() => changeNumber()}
            style={{
              flex: 2,
              color: colors.text,
              fontSize: 20,
              fontWeight: "bold",
            }}
            value={count}
          ></TextInput>
        </View>
      </View>
    </View>
  );
}
