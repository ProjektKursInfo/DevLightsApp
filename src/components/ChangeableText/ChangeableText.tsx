import { faCheck, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as React from "react";
import {
  StyleSheet, TextInput as Input,
  TextInputProps,
  View
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";

export interface ChangeableTextProps extends TextInputProps {
  onSave: (text: string) => void;
  style: any,
}

export default function ChangeableText(props: ChangeableTextProps): JSX.Element {
  const { colors } = useTheme();
  const { onSave, style, value, ...rest } = props;

  const [editable, setEditable] = React.useState<boolean>(false);
  const [text, setText] = React.useState<string>(value ?? "");

  const inputRef = React.useRef<Input>(null);

  React.useEffect(() => {
    editable ? inputRef?.current?.focus() : undefined;
  }, [editable])

  const handleSave = (): void => {
    //TODO remove underline on button press
    props.onSave(text);
    setEditable(false);
  };
  const handleEdit = (): void => {
    setEditable(true);
  };
  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      ...style
    },
    icon: {
      marginLeft: 10,
    },
    input: {
      color: colors.text,
      fontSize: 40,
      fontWeight: "600",
      fontFamily: "TitilliumWeb-Bold"
    },
  });
  return (
    <View style={styles.container}>
      <Input
        selectionColor={colors.primary + "77"}
        editable={editable}
        onSubmitEditing={handleSave}
        onChangeText={setText}
        ref={inputRef}
        textAlign={"center"}
        style={styles.input}
        value={text}
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
