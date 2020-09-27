import React, { useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Navigation from "./components/Navigation/Navigation";


export default function App() {
  
  return (
    <SafeAreaView style={{width: '100%', height: '100%'}}>
    <Navigation></Navigation>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
