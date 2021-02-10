import {
  faCheck,
  faPen,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput as Input,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";

export interface ChangeableTextProps extends TextInputProps {
  onSave: (text: string) => void;
  editIcon?: IconDefinition;
  saveIcon?: IconDefinition;
  style?: StyleProp<ViewStyle>;
  error?: boolean;
  clearTextOnSubmit?: boolean;
  inputStyle?: StyleProp<TextStyle>;
}

export default function ChangeableText(
  props: ChangeableTextProps
): JSX.Element {
  const { colors } = useTheme();
  const {
    onSave,
    style,
    inputStyle,
    value,
    error,
    editIcon,
    saveIcon,
    clearTextOnSubmit,
    ...rest
  } = props;

  const [editable, setEditable] = React.useState<boolean>(false);
  const [text, setText] = React.useState<string>(value ?? "");

  const inputRef = React.useRef<Input>(null);

  React.useEffect(() => {
    if (editable) inputRef?.current?.focus();
  }, [editable]);

  const clearText = () => {
    inputRef.current?.setNativeProps({ text: "" });
  };

  const handleSave = (): void => {
    // TODO remove underline on button press
    onSave(text);
    setEditable(false);
  };

  React.useEffect(() => {
    if (error) inputRef.current?.setNativeProps({ text: value });
  }, [error]);

  const handleEdit = (): void => {
    setEditable(true);
  };
  const styles = StyleSheet.create({
    container: StyleSheet.flatten([
      {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        flexDirection: "row",
      },
      style,
    ]),
    input: StyleSheet.flatten([
      {
        alignSelf: "center",
        color: colors.text,
        fontSize: 40,
        fontWeight: "600",
        fontFamily: "TitilliumWeb-Bold",
        maxWidth: "88%",
      },
      inputStyle,
    ]),
  });
  return (
    <View style={styles.container}>
      <Input
        selectionColor={`${colors.primary}77`}
        editable={editable}
        textBreakStrategy="highQuality"
        onSubmitEditing={handleSave}
        onChangeText={(text: string) => setText(text.replace("\n", ""))}
        multiline
        ref={inputRef}
        textAlign="center"
        style={styles.input}
        value={text}
        {...rest}
      />
      <TouchableOpacity
        style={{ alignItems: "center" }}
        onPress={editable ? handleSave : handleEdit}
      >
        <FontAwesomeIcon
          style={{ alignSelf: "center" }}
          icon={editable ? saveIcon ?? faCheck : editIcon ?? faPen}
          color={colors.text}
          size={18}
        />
      </TouchableOpacity>
    </View>
  );
}
