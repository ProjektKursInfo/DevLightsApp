import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import * as React from "react";
import { View } from "react-native";
import { IconButton, List } from "react-native-paper";
import HeaderIcon from "../HeaderIcon/HeaderIcon";
import Home from "../Home";
import LightScreen from "../LightScreens/LightScreen";
import theme from "../theme";
import { default as MaterialIcon } from "react-native-vector-icons/MaterialCommunityIcons";

export interface NavigationProps {}

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
      <Stack.Screen
        name="light"
        options={({ route }) => ({
          headerBackImage: () => (
            <MaterialIcon size={24} color="#fff" name="close"></MaterialIcon>
          ),
          headerBackTitleVisible: false,
          title: route.params
            ? route.params.name
              ? route.params.name
              : route.params.ip
            : "Name not found",
          gestureEnabled: true,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        })}
        component={LightScreen}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
