import { faCheck, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput as Input,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";

export interface ChangeableTextProps extends TextInputProps {
  onSave: (text: string) => void;
  style: StyleProp<TextStyle> | StyleProp<ViewStyle>;
}

export default function ChangeableText(props: ChangeableTextProps): JSX.Element {
  const { colors } = useTheme();
  const { onSave, style, value, ...rest } = props;

  const [editable, setEditable] = React.useState<boolean>(false);
  const [text, setText] = React.useState<string>(value ?? "");

  const inputRef = React.useRef<Input>(null);

  React.useEffect(() => {
    if (editable) inputRef?.current?.focus();
  }, [editable]);

  const handleSave = (): void => {
    // TODO remove underline on button press
    onSave(text);
    setEditable(false);
  };
  const handleEdit = (): void => {
    setEditable(true);
  };
  const styles = StyleSheet.create({
    container: StyleSheet.flatten([{
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    }, style]),
    icon: {
      marginLeft: 10,
    },
    input: {
      color: colors.text,
      fontSize: 40,
      fontWeight: "600",
      fontFamily: "TitilliumWeb-Bold",
    },
  });
  return (
    <View style={styles.container}>
      <Input
        selectionColor={`${colors.primary}77`}
        editable={editable}
        onSubmitEditing={handleSave}
        onChangeText={setText}
        ref={inputRef}
        textAlign="center"
        style={styles.input}
        value={text}
        {...rest}
      />
      <TouchableOpacity onPress={editable ? handleSave : handleEdit}>
        <FontAwesomeIcon
          icon={editable ? faCheck : faPen}
          color={colors.text}
          size={18}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}
