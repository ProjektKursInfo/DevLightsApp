import * as React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export interface RainbowComponentProps {
  timeout: number;
  disabled: boolean;
  onSubmit: (colors: string | string[], timeout: number) => Promise<boolean>;
}

export default function RainbowComponent(
  props: RainbowComponentProps,
): JSX.Element {
  const { timeout, disabled } = props;
  const theme = useTheme();
  const ref = React.useRef<TextInput>();

  const submit = (pTimeout: string) => {
    const newTimeout = parseInt(pTimeout, 10);
    props.onSubmit([], newTimeout).catch(() => {
      ref.current?.setNativeProps({ text: timeout.toString() });
    });
  };

  const styles = StyleSheet.create({
    timeoutContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginLeft: theme.spacing(8),
      marginRight: theme.spacing(5),
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
  });
  return (
    <View>
      <View style={styles.timeoutContainer}>
        <Text style={styles.title}>Timeout</Text>
        <TextInput
          editable={!disabled}
          ref={ref as React.RefObject<TextInput>}
          keyboardType="number-pad"
          onSubmitEditing={({ nativeEvent: { text } }) => submit(text)}
          textAlign="right"
          style={styles.textinput}
          defaultValue={timeout?.toString() ?? "100"}
        />
      </View>
    </View>
  );
}
