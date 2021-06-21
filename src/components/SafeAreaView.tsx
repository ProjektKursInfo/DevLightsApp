import React, { ReactNode, ReactNodeArray } from "react";
import {
  View,
  Platform,
  StyleSheet,
  Dimensions,
  StatusBar,
  AppState,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface SafeAreaViewProps {
  children: ReactNodeArray | ReactNode;
}
export default function SafeAreaView(props: SafeAreaViewProps): JSX.Element {
  const insets = useSafeAreaInsets();
  const { children } = props;
  const styles = StyleSheet.create({
    container: {
      marginTop: Platform.OS === "ios" ? insets.top : 0,
      width: Dimensions.get("screen").width,
      height: Dimensions.get("screen").height - insets.bottom,
      backgroundColor: "#000",
    },
  });
  return <View style={styles.container}>{children}</View>;
}
