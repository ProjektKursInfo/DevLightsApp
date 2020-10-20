import { useNavigation, useRoute } from "@react-navigation/native";
import * as React from "react";
import { Component } from "react";
import { View } from "react-native";
import { Text, Title } from "react-native-paper";

export default function LightScreen() {
  const route = useRoute();

  return (
    <View>
      <Title style={{ textAlign: "center" }}>
        {" "}
        Setup or Edit your DevLight{" "}
      </Title>
    </View>
  );
}
