import React from "react";
import {
  createStackNavigator,
  StackHeaderLeftButtonProps,
  StackNavigationProp
} from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "react-native-paper";
import Tags from "../Tags";
import TagScreen from "../Tags/TagScreen";
import Icon from "../Icon/Icon";

export type TagsStackParamList = {
  home: undefined;
  tag: {
    tag: string;
  };
};

export type TagScreenNavigationProp = StackNavigationProp<
TagsStackParamList,
"tag"
>;
export type HomeScreenNavigationProp = StackNavigationProp<
TagsStackParamList,
"home"
>;
export type HomeScreenRouteProp = RouteProp<TagsStackParamList, "home">;
export type TagScreenRouteProp = RouteProp<TagsStackParamList, "tag">;

export default function TagsNavigator(): JSX.Element {
  const Stack = createStackNavigator<TagsStackParamList>();
  const theme = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        options={{ headerTitle: "" }}
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
        }}
        component={TagScreen}
      />
    </Stack.Navigator>
  );
}
