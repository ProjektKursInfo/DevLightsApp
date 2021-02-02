import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { StyleSheet, View } from "react-native";

export default function Circle(props: { colors: string[] }): JSX.Element {
  const { colors } = props;
  const styles = StyleSheet.create({
    root: {
      flexDirection: "row",
    },
    gradient: { borderRadius: 100, height: 40, width: 40 },
  });
  return (
    <View style={styles.root}>
      <LinearGradient
        start={[0.25, 0.25]}
        end={[0.75, 0.75]}
        colors={[colors[0], colors[1] ?? colors[0]]}
        style={styles.gradient}
      />
    </View>
  );
}
