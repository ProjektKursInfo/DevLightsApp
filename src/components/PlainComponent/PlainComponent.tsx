import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { ColorModalScreenNavigationProp } from "../ColorPicker/ColorPicker";

export interface PlainComponentProps {
  colors: string[];
  onSubmit: (color: string) => Promise<boolean>;
  disabled: boolean;
}

export default function PlainComponent(
  props: PlainComponentProps,
): JSX.Element {
  const { colors, disabled } = props;
  const navigation = useNavigation<ColorModalScreenNavigationProp>();
  const onSubmit = async (color: string): Promise<boolean> => {
    const ax = await props.onSubmit(color);
    return ax;
  };
  const onPress = () => {
    navigation.navigate("color_modal", {
      color: colors[0],
      onSubmit,
    });
  };

  const styles = StyleSheet.create({
    button: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
    },
  });
  return (
    <View>
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
