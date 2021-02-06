import React from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import {
  createStackNavigator,
  StackHeaderLeftButtonProps,
  StackNavigationProp,
  TransitionPresets
} from "@react-navigation/stack";
import { useTheme } from "react-native-paper";
import { faChevronLeft, faStar, faTimes } from "@fortawesome/free-solid-svg-icons";
import Icon from "../Icon";
import Home from "../Home";
import LightScreens from "../LightScreens";
import ColorPicker from "../ColorPicker";
import Favourite from "../Favourite";

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

export default function HomeStack(): JSX.Element {
  const Stack = createStackNavigator<HomeStackParamList>();
  const navigation = useNavigation();
  const theme = useTheme();
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
            <Icon
              color={theme.colors.accent}
              position="left"
              icon={faChevronLeft}
              {...props}
            />
          ),
          headerTitle: "",
          gestureEnabled: true,
          gestureResponseDistance: { vertical: 200},
          ...TransitionPresets.SlideFromRightIOS,
        })}
        component={LightScreens}
      />
      <Stack.Screen
        name="color_modal"
        options={{
          headerLeft: (props: StackHeaderLeftButtonProps) => (
            <Icon
              color={theme.colors.accent}
              position="left"
              icon={faTimes}
              {...props}
            />
          ),
          headerTitle: "",
        }}
        component={ColorPicker}
      />
      <Stack.Screen
        options={{
          headerTitle: "Favourites",
          headerTitleAlign: "center",
          headerTitleStyle: {
            marginTop: 20,
          },
          headerLeft: (props: StackHeaderLeftButtonProps) => (
            <Icon
              color={theme.colors.accent}
              icon={faTimes}
              position="left"
              {...props}
            />
          ),
        }}
        name="favourite"
        component={Favourite}
      />
    </Stack.Navigator>
  );
}
