import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Button } from "react-native-paper";

export interface PlainComponentProps {
  colors: string[];
  id: string;
  pattern: string;
}

export default function PlainComponent(
  props: PlainComponentProps
): JSX.Element {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("color_modal", {
      colors: props.colors,
      id: props.id,
      pattern: props.pattern,
    });
  };
  console.log("moin");
  console.log(props.colors[0]);
  return (
    <>
      <Button
        mode="contained"
        style={{ width: "70%", alignSelf: "center", marginTop: 20 }}
        onPress={onPress}
        color={props.colors[0].toString()}
      >
        {props.colors[0].toString()}
      </Button>
    </>
  );
}
