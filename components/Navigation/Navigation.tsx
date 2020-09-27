import * as React from "react";

import { IconButton, List } from "react-native-paper";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import { createStackNavigator } from "@react-navigation/stack";
import Home from "../Home/Home";
import { NavigationContainer } from "@react-navigation/native";
import HeaderIcon from "../HeaderIcon/HeaderIcon";
import { View, Text } from "react-native";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
export interface NavigationProps {}

export default function Navigation(props: NavigationProps) {
  const Drawer = createDrawerNavigator();
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="home"
        drawerStyle={{}}
        sceneContainerStyle={{ backgroundColor: "#fff" }}
        drawerContent={(props) => <DrawerContent {...props} />}
      >
        <Drawer.Screen
          component={HomeStack}
          options={{ title: "Home" }}
          name="home"
        ></Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
function DrawerContent(props: DrawerContentComponentProps) {
  const [icon, setIcon] = React.useState("lightbulb");
  const toggleBulb = () => {
    if (icon == "lightbulb") {
      setIcon("lightbulb-outline");
    } else {
      setIcon("lightbulb");
    }
  };
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ margin: 15 }}>
        <List.Item
          title={"DevLights"}
          description={"Control and Setup your Smart Lightsss"}
          left={(props) => (
            <IconButton
              {...props}
              onPress={toggleBulb}
              icon={icon}
              style={{ alignSelf: "center" }}
            ></IconButton>
          )}
        ></List.Item>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
function HomeStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={Home}
        options={{
          title: "Home",
          headerLeft: () => <HeaderIcon></HeaderIcon>,
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
