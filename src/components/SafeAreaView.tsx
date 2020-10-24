import React, { ReactNode, ReactNodeArray } from "react";
import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface SafeAreaViewProps {
  children: ReactNodeArray | ReactNode;
}
export default function SafeAreaView(props: SafeAreaViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        marginTop: Platform.OS == "ios" ? insets.top : 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
      }}
    >
      {props.children}
    </View>
  );
}
