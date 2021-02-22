import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import {
  createStackNavigator,
  StackHeaderLeftButtonProps,
} from "@react-navigation/stack";
import React from "react";
import { useTheme } from "react-native-paper";
import { TagsStackParamList } from "../../interfaces/types";
import Icon from "../Icon/Icon";
import Tags from "../Tags";
import TagScreen from "../Tags/TagScreen";

export default function TagsNavigator(): JSX.Element {
  const Stack = createStackNavigator<TagsStackParamList>();
  const theme = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        options={{
          headerTitle: "",
          headerStyle: {
            elevation: 0,
          },
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
        }}
        component={TagScreen}
      />
    </Stack.Navigator>
  );
}
