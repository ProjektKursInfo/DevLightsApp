import * as React from "react";
import { Component } from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { Text, Title, useTheme } from "react-native-paper";

export default function Settings() {
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: { width: "100%", height: "100%" },
    title: {
      paddingTop: 30,
      marginBottom: 10,
      fontSize: 40,
    },
    contentContainerStyle: {
      alignItems: "center",
      width: "100%",
      height: "100%",
    },
  });
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle="light-content"
      />

      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <Text> Test </Text>
      </ScrollView>
    </View>
  );
}
