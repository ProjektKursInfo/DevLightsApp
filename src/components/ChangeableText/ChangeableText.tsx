import { faCheck, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as React from "react";
import {
  TextInput as Input,
  TextInputProps,
  View,
  StyleSheet,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";

export interface ChangeableTextProps extends TextInputProps {
  onSave: () => void;
}

export default function ChangeableText(props: ChangeableTextProps) {
  const { colors } = useTheme();
  const { onSave, ...rest } = props;

  const [editable, setEditable] = React.useState<boolean>(false);
  const inputRef = React.useRef<Input>(null);
  const handleSave = (): void => {
    props.onSave();
    setEditable(false);
  };
  const handleEdit = (): void => {
    console.log(inputRef.current);
    setEditable(true);
    inputRef?.current?.focus();
  };
  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    icon: {
      marginLeft: 10,
    },
    input: {
      color: colors.text,
      fontSize: 40,
      fontWeight: "bold",
    },
  });
  return (
    <View style={styles.container}>
      <Input
        editable={editable}
        onSubmitEditing={handleSave}
        ref={inputRef}
        textAlign={"center"}
        style={styles.input}
        {...rest}
      ></Input>
      <TouchableOpacity onPress={editable ? handleSave : handleEdit}>
        <FontAwesomeIcon
          icon={editable ? faCheck : faPen}
          color={colors.text}
          size={18}
          style={styles.icon}
        ></FontAwesomeIcon>
      </TouchableOpacity>
    </View>
  );
}
