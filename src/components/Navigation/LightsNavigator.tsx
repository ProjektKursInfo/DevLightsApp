import {
  faChevronLeft,
  faStar,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import {
  createStackNavigator,
  StackHeaderLeftButtonProps,
  TransitionPresets,
} from "@react-navigation/stack";
import React from "react";
import { useTheme } from "react-native-paper";
import { LightsStackParamList } from "../../interfaces/types";
import ColorPicker from "../ColorPicker";
import Favourite from "../Favourite";
import Home from "../Home";
import Icon from "../Icon";
import LightScreens from "../LightScreen";
import CustomScreen from "../CustomScreen";

export default function LightsNavigator(): JSX.Element {
  const Stack = createStackNavigator<LightsStackParamList>();
  const navigation = useNavigation();
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{
        headerStyle: { height: 100, elevation: 0 },
      }}
    >
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
          gestureResponseDistance: { vertical: 200 },
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
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
        component={ColorPicker}
      />
      <Stack.Screen
        name="custom"
        component={CustomScreen}
        options={{
          headerTitle: "Create Custom Pattern",
          headerLeft: (props: StackHeaderLeftButtonProps) => (
            <Icon
              color={theme.colors.accent}
              position="left"
              icon={faChevronLeft}
              {...props}
            />
          ),
        }}
      />

      <Stack.Screen
        options={{
          headerTitle: "Favourites",
          headerTitleAlign: "center",
          headerTitleStyle: {
            marginTop: 10,
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
