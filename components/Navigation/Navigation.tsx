import * as React from "react";

import { IconButton, List } from "react-native-paper";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  useTheme,
  Theme,
} from "@react-navigation/drawer";

import { createStackNavigator } from "@react-navigation/stack";
import Home from "../Home/Home";
import { NavigationContainer } from "@react-navigation/native";
import HeaderIcon from "../HeaderIcon/HeaderIcon";
import { View, Text } from "react-native";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import theme from "../theme";
export interface NavigationProps {}

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      secondary: string;
    }
    interface Theme {
      spacing: Function;
    }
  }
}

export default function Navigation(props: NavigationProps) {
  const Drawer = createDrawerNavigator();
  return (
    <NavigationContainer theme={theme}>
      <Drawer.Navigator
        initialRouteName="home"
        drawerStyle={{}}
        drawerContent={(contentProps) => <DrawerContent {...contentProps} />}
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
  return (
    <DrawerContentScrollView style={{ backgroundColor: "#2f2f2f" }} {...props}>
      <View style={{ margin: 15 }}>
        <List.Item
          title={"DevLights"}
          description={"Control and Setup your Smart Lightsss"}
          left={(iconProps) => (
            <IconButton
              {...iconProps}
              color={theme.colors.primary}
              icon={"lightbulb"}
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
