import { faChevronLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  createStackNavigator,
  StackHeaderLeftButtonProps,
  TransitionPresets,
} from "@react-navigation/stack";
import React from "react";
import { useTheme } from "react-native-paper";
import { TagsStackParamList } from "../../interfaces/types";
import ColorPicker from "../ColorPicker";
import CustomScreen from "../CustomScreen";
import Icon from "../Icon/Icon";
import Tags from "../Tags";
import TagScreen from "../TagScreen/TagScreen";

export default function TagsNavigator(): JSX.Element {
  const Stack = createStackNavigator<TagsStackParamList>();
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
        options={{
          headerTitle: "",
        }}
        component={Tags}
      />
      <Stack.Screen
        name="tag"
        options={{
          headerTitle: "",
          headerTitleAlign: "center",
          headerLeft: (props: StackHeaderLeftButtonProps) => (
            <Icon
              color={theme.colors.accent}
              position="left"
              icon={faChevronLeft}
              {...props}
            />
          ),
          ...TransitionPresets.ScaleFromCenterAndroid,
        }}
        component={TagScreen}
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
    </Stack.Navigator>
  );
}
