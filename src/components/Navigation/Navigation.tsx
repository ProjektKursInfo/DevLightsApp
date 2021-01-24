/* eslint-disable react/jsx-props-no-spreading */
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronLeft,
  faCog,
  faHome,
  faStar,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  createDrawerNavigator
} from "@react-navigation/drawer";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  NavigationContainer,
  RouteProp,
  useNavigation
} from "@react-navigation/native";
import {
  createStackNavigator,
  StackHeaderLeftButtonProps,
  StackNavigationProp,
  TransitionPresets
} from "@react-navigation/stack";
import * as React from "react";
import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import ColorPicker from "../ColorPicker";
import Favourite from "../Favourite";
import Home from "../Home";
import LightScreen from "../LightScreens";
import Settings from "../Settings";

export type HomeStackParamList = {
  home: undefined;
  light: {
    id: string;
  };
  color_modal: {
    id: string;
    index: number;
  };
  favourite: undefined;
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

export type FavouriteScreenNavigationProp = StackNavigationProp<
HomeStackParamList,
"favourite"
>;

export type HomeScreenRouteProp = RouteProp<HomeStackParamList, "home">;
export type LightScreenRouteProp = RouteProp<HomeStackParamList, "light">;
export type ColorModalScreenRouteProp = RouteProp<
HomeStackParamList,
"color_modal"
>;
export type FavouriteScreenRouteProp = RouteProp<
HomeStackParamList,
"favourite"
>;

function Icon(
  // eslint-disable-next-line react/require-default-props
  props: StackHeaderLeftButtonProps & {
    icon: IconProp;
    color?: string;
    position: "left" | "right";
  }
): JSX.Element {
  const { colors } = useTheme();
  const { onPress, icon, color, position } = props;
  const styles = StyleSheet.create({
    icon: {
      marginLeft: position === "left" ? 30 : 0,
      marginRight: position === "right" ? 30 : 0,
      marginTop: 20,
    },
  });
  return (
    <Pressable onPress={onPress}>
      <FontAwesomeIcon
        style={styles.icon}
        color={color ?? colors.accent}
        size={30}
        icon={icon}
      />
    </Pressable>
  );
}

function HomeStack() {
  const Stack = createStackNavigator<HomeStackParamList>();
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={Home}
        options={{
          title: "Home",
          headerTitle: "",
          headerRight: () => (
            <Icon
              color="#ffff00"
              icon={faStar}
              position="right"
              onPress={() => navigation.navigate("favourite")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="light"
        options={() => ({
          headerBackTitleVisible: false,
          headerLeft: (props: StackHeaderLeftButtonProps) => (
            <Icon position="left" icon={faChevronLeft} {...props} />
          ),
          headerTitle: "",
          gestureEnabled: true,
          gestureResponseDistance: 200,
          ...TransitionPresets.SlideFromRightIOS,
        })}
        component={LightScreen}
      />
      <Stack.Screen
        name="color_modal"
        options={{
          headerLeft: (props: StackHeaderLeftButtonProps) => (
            <Icon position="left" icon={faTimes} {...props} />
          ),
          headerTitle: "",
        }}
        component={ColorPicker}
      />
      <Stack.Screen
        options={{
          headerTitle: "Favourite Colors",
          headerTitleAlign: "center",
          headerTitleStyle: {
            marginTop: 20,
          },
          headerLeft: (props: StackHeaderLeftButtonProps) => (
            <Icon icon={faTimes} position="left" {...props} />
          ),
        }}
        name="favourite"
        component={Favourite}
      />
    </Stack.Navigator>
  );
}

function SettingsNavigator() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" options={{ headerTitle: "Settings", headerTitleAlign: "left"}} component={Settings} />
    </Stack.Navigator>
  );
}

export default function Navigation(): JSX.Element {
  const theme = useTheme();
  const Tab = createMaterialBottomTabNavigator();
  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator labeled={false} initialRouteName="home">
        <Tab.Screen
          component={HomeStack}
          options={{
            tabBarIcon: (props: { color: string }) => (
              // eslint-disable-next-line react/destructuring-assignment
              <FontAwesomeIcon color={props.color} icon={faHome} size={26} />
            ),
          }}
          name="home"
        />
        <Tab.Screen
          component={SettingsNavigator}
          options={{
            tabBarIcon: (props: { color: string }) => (
              // eslint-disable-next-line react/destructuring-assignment
              <FontAwesomeIcon color={props.color} icon={faCog} size={26} />
            ),
          }}
          name="settings"
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
