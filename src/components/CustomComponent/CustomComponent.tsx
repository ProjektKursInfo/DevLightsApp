import { Pattern } from "@devlights/types";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Circle from "../Circle";

export interface CustomComponentProps {
  colors: string[];
  id: string;
  type: "light" | "tag";
  oldPattern: Pattern;
  onSubmit: () => Promise<Pattern>;
}
export default function CustomComponent(
  props: CustomComponentProps,
): JSX.Element {
  const { colors, id, type, oldPattern, onSubmit } = props;
  const navigation = useNavigation();
  const theme = useTheme();

  const navigate = () => {
    navigation.navigate("custom", { id, type, onSubmit });
  };
  const styles = StyleSheet.create({
    colors_container: {
      marginTop: theme.spacing(2),
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    color: {
      marginLeft: theme.spacing(2),
    },
    text: {
      textAlign: "center",
    },
    button: {
      marginTop: theme.spacing(4),
      width: "70%",
      alignSelf: "center",
    },
  });
  return (
    <View>
      {oldPattern === "custom" ? (
        <>
          <Text style={styles.text}> Colors used in this Custom Pattern</Text>
          <View style={styles.colors_container}>
            {colors.map((c: string) => (
              <View style={styles.color}>
                <Circle colors={[c]} />
              </View>
            ))}
          </View>
        </>
      ) : undefined}
      <Button
        mode="contained"
        color={theme.colors.accent}
        style={styles.button}
        onPress={navigate}
      >
        {`${oldPattern === "custom" ? "other" : "new"} custom pattern`}
      </Button>
    </View>
  );
}
