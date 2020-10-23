import { faCheck, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as React from "react";
import { Text, TextInput as Input, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";

export interface TextInputProps {
  text: string;
  editable: boolean;
  onChangeText(text: string): void;
  onEditPress: void;
  onSave: void;
}

export default function ChangeableText(props: TextInputProps) {
  const { colors } = useTheme();
  const { editable, onEditPress, onSave, ...rest } = props;
  /* console.log(rest.editable); */
  return (
    <>
      {editable ? (
        <View style={{ justifyContent: "center", flexDirection: "row" }}>
          <Input
            editable={props.editable}
            onSubmitEditing={onSave}
            textAlign="center"
            style={{
              color: colors.text,
              fontSize: 40,
              fontWeight: "bold",
            }}
            {...rest}
          ></Input>
          <TouchableOpacity
            containerStyle={{ alignSelf: "center" }}
            onPress={onSave}
          >
            <FontAwesomeIcon
              icon={faCheck}
              color={colors.text}
              size={18}
              style={{ alignSelf: "center", marginLeft: 10 }}
            ></FontAwesomeIcon>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ justifyContent: "center", flexDirection: "row" }}>
          <Text
            style={{ color: colors.text, fontSize: 40, fontWeight: "bold" }}
          >
            {props.value}
          </Text>
          <TouchableOpacity
            containerStyle={{ alignSelf: "center" }}
            onPress={onEditPress}
          >
            <FontAwesomeIcon
              icon={faPen}
              color={colors.text}
              size={18}
              style={{ alignSelf: "center", marginLeft: 10 }}
            ></FontAwesomeIcon>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
