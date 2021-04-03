import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  createStackNavigator,
  StackHeaderLeftButtonProps,
  TransitionPresets,
} from "@react-navigation/stack";
import * as React from "react";
import { useTheme } from "react-native-paper";
import { AlarmStackParamList } from "../../interfaces/types";
import Alarms from "../Alarms";
import ColorPicker from "../ColorPicker";
import Icon from "../Icon";

export default function AlarmNavigator(): JSX.Element {
  const Stack = createStackNavigator<AlarmStackParamList>();
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { height: 100, elevation: 0 },
      }}
    >
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTitleAlign: "left",
          headerStyle: {
            elevation: 0,
          },
        }}
        name="home"
        component={Alarms}
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
    </Stack.Navigator>
  );
}
