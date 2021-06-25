import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FAB, useTheme } from "react-native-paper";
import { Custom } from "../../interfaces/types";
import ChangeableText from "../ChangeableText";
import Circle from "../Circle";
import { LightScreenNavigationProp } from "../LightScreen/LightScreen";

export interface CustomDataProps {
  custom: Custom;
  onChange: (c: Custom) => void;
}
export default function CustomData(props: CustomDataProps): JSX.Element {
  const { custom } = props;
  const [repeat, setRepeat] = React.useState<number>(custom.repeat);
  const [colors, setColors] = React.useState<string[]>(custom.leds);
  const [error, setError] = React.useState<boolean>(false);
  const navigation = useNavigation<LightScreenNavigationProp>();
  const theme = useTheme();

  const onSubmit = (c: string, i?: number) => {
    const cols = colors;
    cols[i ?? 0] = c;
    setColors(cols);
    props.onChange({ leds: cols, repeat });
    return true;
  };

  const setRepeats = (repeats: number) => {
    setRepeat(repeat);
    props.onChange({ leds: colors, repeat: repeats });
  };

  const onChange = (text: string) => {
    setError(false);
    if (!/^\d+$/.test(text) || parseInt(text, 10) > 1000) {
      setError(true);
      setRepeats(1);
      setError(false);
    } else {
      setRepeats(parseInt(text, 10));
    }
  };

  const styles = StyleSheet.create({
    colors_container: {
      flexDirection: "row",
      justifyContent: "flex-start",
      flexWrap: "wrap",
    },
    opacity: {
      marginLeft: theme.spacing(1),
    },
  });
  return (
    <>
      <ChangeableText
        value={repeat.toString()}
        onSave={(text: string) => onChange(text)}
        error={error}
        keyboardType="number-pad"
      />
      <View style={styles.colors_container}>
        {colors.map((c: string, i: number) => (
          <TouchableOpacity
            style={styles.opacity}
            onPress={() => {
              navigation.navigate("color_modal", {
                color: c,
                index: i,
                onSubmit,
              });
            }}
          >
            <Circle colors={[c]} />
          </TouchableOpacity>
        ))}
        <FAB
          style={styles.opacity}
          small
          icon="plus"
          onPress={() => setColors([...colors, "#000"])}
        />
      </View>
    </>
  );
}
