import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faChevronLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList
} from "@react-navigation/drawer";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import {
  createStackNavigator,
  StackHeaderLeftButtonProps,
  StackNavigationProp,
  TransitionPresets
} from "@react-navigation/stack";
import * as React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { IconButton, List, useTheme } from "react-native-paper";
import ColorPicker from "../ColorPicker";
import HeaderIcon from "../HeaderIcon/HeaderIcon";
import Home from "../Home";
import LightScreen from "../LightScreens";

export type HomeStackParamList = {
  home: undefined;
  light: {
    id: string;
  };
  color_modal: { id: string };
};

export type LightScreenNavigationProp = StackNavigationProp<HomeStackParamList, "light">;
export type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, "home">;
export type ColorModalScreenNavigationProp = StackNavigationProp<HomeStackParamList, "color_modal">;

export type HomeScreenRouteProp = RouteProp<HomeStackParamList, "home">;
export type LightScreenRouteProp = RouteProp<HomeStackParamList, "light">;
export type ColorModalScreenRouteProp = RouteProp<HomeStackParamList, "color_modal">;

function DrawerContent(props: DrawerContentComponentProps) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    scrollview: {
      backgroundColor: "#2f2f2f",
    },
    container: {
      margin: 15,
    },
    icon: {
      alignSelf: "center",
    },
    list: {
      fontFamily: "TitilliumWeb-Regular",
    },
  });
  return (
    <DrawerContentScrollView style={styles.scrollview} {...props}>
      <View style={styles.container}>
        <List.Item
          title="DevLights"
          description="Controland Setup your Smart Lights"
          left={(iconProps) => (
            <IconButton
              {...iconProps}
              color={theme.colors.primary}
              icon="lightbulb"
              style={styles.icon}
            />
          )}
        />
      </View>
      <DrawerItemList labelStyle={styles.list} {...props} />
    </DrawerContentScrollView>
  );
}

function BackIcon(props: StackHeaderLeftButtonProps & { icon: IconProp }) : JSX.Element {
  const { colors } = useTheme();
  const { onPress, icon } = props;
  const styles = StyleSheet.create({
    icon: {
      marginLeft: 20,
      marginTop: 10,
    },
  });
  return (
    <Pressable onPress={onPress}>
      <FontAwesomeIcon style={styles.icon} color={colors.accent} size={30} icon={icon} />
    </Pressable>
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
          headerTitle: "",
          headerLeft: () => <HeaderIcon />,
        }}
      />
      <Stack.Screen
        name="light"
        options={() => ({
          headerBackTitleVisible: false,
          headerLeft: (props: StackHeaderLeftButtonProps) => (
            <BackIcon icon={faChevronLeft} {...props} />
          ),

          headerTitle: "",
          gestureEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
          gestureResponseDistance: 200,
        })}
        component={LightScreen}
      />
      <Stack.Screen
        name="color_modal"
        options={{
          headerLeft: (props: StackHeaderLeftButtonProps) => (
            <BackIcon icon={faTimes} {...props} />
          ),
          headerTitle: "",
        }}
        component={ColorPicker}
      />
    </Stack.Navigator>
  );
}

export default function Navigation(): JSX.Element {
  const theme = useTheme();
  const Drawer = createDrawerNavigator();
  return (
    <NavigationContainer theme={theme}>
      <Drawer.Navigator
        initialRouteName="home"
        drawerContent={(contentProps) => <DrawerContent {...contentProps} />}
      >
        <Drawer.Screen
          component={HomeStack}
          options={{ title: "Home" }}
          name="home"
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
