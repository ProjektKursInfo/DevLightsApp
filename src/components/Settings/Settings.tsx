import { faAdjust } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { List, Title, useTheme } from "react-native-paper";
import { ThemeType } from "../../interfaces/types";
import ThemeDialog from "../ThemeDialog";

export default function Settings() : JSX.Element {
  const theme = useTheme();
  const [visible, setVisible] = React.useState<boolean>(false);
  const [themeType, setType] = React.useState<ThemeType>();
  React.useEffect(() => {
    async function get() {
      AsyncStorage.getItem("theme").then((t) => {
        setType(t);
      });
    }
    get();
  }, []);
  console.log(themeType);
  const styles = StyleSheet.create({
    container: { width: "100%", height: "100%" },
    title: {
      paddingTop: 30,
      marginBottom: 10,
      fontSize: 40,
    },
    contentContainerStyle: {
      width: "100%",
      height: "100%",
    },
    themeText: {
      textAlign: "center",
    },
    listItem: {
      width: "100%",
    },
    listItemTitle: {
      fontSize: 20,
    },
    listIcon: {
      alignSelf: "center",
    },
  });
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle="light-content"
      />

      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <List.Section title="Apperance" titleStyle={styles.themeText} />
        <List.Item style={styles.listItem} title="Theme" description={themeType} titleStyle={styles.listItemTitle} onPress={() => setVisible(true)} left={() => <FontAwesomeIcon color={theme.colors.text} style={styles.listIcon} icon={faAdjust} />} />
        <ThemeDialog visible={visible} onDismiss={() => setVisible(false)} />
      </ScrollView>
    </View>
  );
}
