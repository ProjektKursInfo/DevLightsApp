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
import theme from "../theme";

export interface ChangeableTextProps extends TextInputProps {
  onSave: () => void;
  style: any,
}

export default function ChangeableText(props: ChangeableTextProps) {
  const { colors } = useTheme();
  const { onSave, style, ...rest } = props;

  const [editable, setEditable] = React.useState<boolean>(false);

  const inputRef = React.useRef<Input>(null);

  React.useEffect(() => {
    editable ? inputRef?.current?.focus() : undefined;
  }, [editable])

  const handleSave = (): void => {
    //TODO remove underline on button press
    props.onSave();
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
      fontWeight: "bold",
    },
  });
  return (
    <View style={styles.container}>
      <Input
        selectionColor={theme.colors.primary + "77"}
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
