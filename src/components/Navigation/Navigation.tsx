import {
  faCog,
  faHome,

  faTags
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  NavigationContainer
} from "@react-navigation/native";
import {
  createStackNavigator
} from "@react-navigation/stack";
import * as React from "react";
import { useTheme } from "react-native-paper";
import Settings from "../Settings";
import HomeStack from "./LightsNavigator";
import TagsNavigator from "./TagsNavigator";

function SettingsNavigator() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        options={{ headerTitle: "Settings", headerTitleAlign: "left" }}
        component={Settings}
      />
    </Stack.Navigator>
  );
}

export default function Navigation(): JSX.Element {
  const theme = useTheme();
  const Tab = createMaterialBottomTabNavigator();
  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        barStyle={{ backgroundColor: theme.colors.accent }}
        labeled={false}
        initialRouteName="home"
      >
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
          name="tags"
          component={TagsNavigator}
          options={{
            tabBarIcon: (props: { color: string }) => (
              // eslint-disable-next-line react/destructuring-assignment
              <FontAwesomeIcon color={props.color} icon={faTags} size={26} />
            ),
          }}
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
