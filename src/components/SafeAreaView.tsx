import React, { ReactNode, ReactNodeArray } from "react";
import { View, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface SafeAreaViewProps {
  children: ReactNodeArray | ReactNode;
}
export default function SafeAreaView(props: SafeAreaViewProps): JSX.Element {
  const insets = useSafeAreaInsets();
  const {children} = props;
  const styles = StyleSheet.create({
    container: {
      marginTop: Platform.OS === "ios" ? insets.top : 0,
      width: "100%",
      height: "100%",
      backgroundColor: "#fff",
    },
  });
  return (
    <View
      style={styles.container}
    >
      {children}
    </View>
  );
}
