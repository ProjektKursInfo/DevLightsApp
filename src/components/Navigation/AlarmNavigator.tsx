import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import Alarms from "../Alarms";

export default function AlarmNavigator(): JSX.Element {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
}
