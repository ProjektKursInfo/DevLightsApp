/* eslint-disable react/jsx-props-no-spreading */
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronLeft,
  faStar,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  NavigationContainer,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import {
  createStackNavigator,
  StackHeaderLeftButtonProps,
  StackNavigationProp,
  TransitionPresets,
} from "@react-navigation/stack";
import * as React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { IconButton, List, useTheme } from "react-native-paper";
import ColorPicker from "../ColorPicker";
import Favourite from "../Favourite";
import HeaderIcon from "../HeaderIcon/HeaderIcon";
import Home from "../Home";
import LightScreen from "../LightScreens";

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
          description="Control and Setup your Smart Lights"
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
          headerLeft: () => <HeaderIcon />,
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
