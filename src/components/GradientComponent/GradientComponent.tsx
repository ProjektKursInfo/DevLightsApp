import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as fullstar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { isEqual } from "lodash";
import * as React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Light } from "@devlights/types";
import { Gradient } from "../../store/types/favouriteGradients";
import { Store } from "../../store";
import {
  addFavouriteGradient,
  removeFavouriteGradient
} from "../../store/actions/favourites";
import { isFavouriteGradient } from "../../utils";
import { LightScreenNavigationProp } from "../Navigation/LightsNavigator";

export interface GradientComponentProps {
  id: string;
}

export default function GradientComponent(
  props: GradientComponentProps,
): JSX.Element {
  const navigation = useNavigation<LightScreenNavigationProp>();
  const light: Light = useSelector(
    (state: Store) => (
      state.lights.find((l: Light) => l.id === props.id) as Light),
    (left: Light, right: Light) => !isEqual(left.leds.colors, right.leds.colors),
  );
  const favouriteGradients: Gradient[] = useSelector(
    (state: Store) => state.favouriteGradients,
  );
  const dispatch = useDispatch();
  const theme = useTheme();

  const onPress = (index: number) => {
    navigation.navigate("color_modal", {
      id: props.id,
      index,
    });
  };
  const [icon, setIcon] = React.useState<IconProp>(faStar);

  const saveColor = () => {
    const gradient: Gradient = {
      start: light.leds.colors[0],
      end: light.leds.colors[1],
    };
    if (isFavouriteGradient(favouriteGradients, gradient)) {
      dispatch(removeFavouriteGradient(gradient));
      setIcon(faStar);
    } else {
      dispatch(addFavouriteGradient(gradient));
      setIcon(fullstar);
    }
  };

  React.useEffect(() => {
    if (
      isFavouriteGradient(favouriteGradients, {
        start: light.leds.colors[0],
        end: light.leds.colors[1],
      })
    ) {
      setIcon(fullstar);
    } else setIcon(faStar);
  }, []);

  const styles = StyleSheet.create({
    button: {
      width: "40%",
      alignSelf: "center",
      margin: 20,
    },
    container: {
      flexDirection: "row",
      alignSelf: "center",
      alignContent: "space-between",
    },
    pressable: {alignSelf: "flex-end", marginRight: 10},
  });
  return (
    <>
      <Pressable style={styles.pressable} onPress={() => saveColor()}>
        <FontAwesomeIcon color={theme.colors.accent} size={30} icon={icon} />
      </Pressable>
      <View style={styles.container}>
        <Button
          disabled={!light.isOn}
          mode="contained"
          style={styles.button}
          onPress={() => onPress(0)}
          color={light.leds.colors[0]}
        >
          {light.leds.colors[0]}
        </Button>
        <Button
          disabled={!light.isOn}
          mode="contained"
          style={styles.button}
          onPress={() => onPress(1)}
          color={light.leds.colors[1]}
        >
          {light.leds.colors[1]}
        </Button>
      </View>
    </>
  );
}
