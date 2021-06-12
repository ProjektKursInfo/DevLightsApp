import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { ColorModalScreenNavigationProp } from "../ColorPicker/ColorPicker";

export interface RunnerComponentProps {
  colors: string[];
  timeout: number;
  disabled: boolean;
  onSubmit: (color: string, timeout?: number) => Promise<boolean>;
}

export default function RunnerComponent(
  props: RunnerComponentProps,
): JSX.Element {
  const { colors, timeout, disabled, onSubmit } = props;
  const navigation = useNavigation<ColorModalScreenNavigationProp>();
  const theme = useTheme();
  const ref = React.useRef<TextInput>();

  const onPress = () => {
    navigation.navigate("color_modal", {
      color: colors[0],
      onSubmit,
      index: 0,
    });
  };

  const styles = StyleSheet.create({
    button: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
    },
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
          onSubmitEditing={({ nativeEvent: { text } }) =>
            onSubmit(colors[0], parseInt(text, 10))
          }
          textAlign="right"
          style={styles.textinput}
          defaultValue={timeout?.toString() ?? "100"}
        />
      </View>
      <Button
        disabled={disabled}
        mode="contained"
        style={styles.button}
        onPress={onPress}
        color={colors[0]}
      >
        {colors[0]}
      </Button>
    </View>
  );
}
