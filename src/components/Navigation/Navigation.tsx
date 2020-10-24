import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faChevronLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList
} from "@react-navigation/drawer";
import { NavigationContainer, RouteProp, useTheme } from "@react-navigation/native";
import {
  createStackNavigator,
  StackHeaderLeftButtonProps,
  StackNavigationProp,
  TransitionPresets
} from "@react-navigation/stack";
import * as React from "react";
import { Pressable, View } from "react-native";
import { IconButton, List } from "react-native-paper";
import ColorPicker from "../ColorPicker/ColorPicker";
import HeaderIcon from "../HeaderIcon/HeaderIcon";
import Home from "../Home";
import LightScreen from "../LightScreens/LightScreen";
import theme from "../theme";

export type HomeStackParamList = {
  home: undefined;
  light: {
    name: string;
    id: string;
    pattern: string;
    colors: string[];
    count: number;
  };
  color_modal: { colors: string[]; id: string; pattern: string };
};

export type LightScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "light"
>;
export type HomeScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "home"
>;
export type ColorModalScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "color_modal"
>;

export type HomeScreenRouteProp = RouteProp<HomeStackParamList, "home">;
export type LightScreenRouteProp = RouteProp<HomeStackParamList, "light">;
export type ColorModalScreenRouteProp = RouteProp<
  HomeStackParamList,
  "color_modal"
>;


export default function Navigation() {
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
          description={"Control and Setup your Smart Lights"}
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
  const Stack = createStackNavigator<HomeStackParamList>();
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
          headerBackTitleVisible: false,
          headerLeft: (props: StackHeaderLeftButtonProps) => <BackIcon icon={faChevronLeft} {...props} />,

          headerTitle: "",
          gestureEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
          gestureResponseDistance: 200
        })}
        component={LightScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="color_modal"
        options={{
          headerLeft: (props: StackHeaderLeftButtonProps) => <BackIcon icon={faTimes} {...props}></BackIcon>,
          headerTitle: "",
        }}
        component={ColorPicker}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

function BackIcon(props: StackHeaderLeftButtonProps & { icon: IconProp }) {

  const { colors } = useTheme();
  return (
    <Pressable onPress={props.onPress}>
      <FontAwesomeIcon style={{ marginLeft: 20, marginTop: 10 }} color={colors.text} size={30} icon={props.icon}></FontAwesomeIcon>
    </Pressable>
  )
}
