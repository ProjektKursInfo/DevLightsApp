import { Light } from "@devlights/types";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import {
  faExchangeAlt,
  faStar as fullstar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { isEqual, isUndefined } from "lodash";
import * as React from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, useTheme, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import useLight from "../../hooks/useLight";
import { Store } from "../../store";
import {
  addFavouriteGradient,
  removeFavouriteGradient,
} from "../../store/actions/favourites";
import { Gradient } from "../../store/types/favouriteGradients";
import { isFavouriteGradient, makeValidColorArray } from "../../utils";
import { ColorModalScreenNavigationProp } from "../ColorPicker/ColorPicker";
import FavouriteGradientList from "../FavouriteGradientList";

export interface GradientComponentProps {
  id: string;
}

export default function GradientComponent(
  props: GradientComponentProps,
): JSX.Element {
  const navigation = useNavigation<ColorModalScreenNavigationProp>();
  const light: Light = useSelector(
    (state: Store) =>
      state.lights.find((l: Light) => l.id === props.id) as Light,
    (left: Light, right: Light) =>
      !isEqual(left.leds.colors, right.leds.colors),
  );
  const favouriteGradients: Gradient[] = useSelector(
    (state: Store) => state.favouriteGradients,
  );
  const [icon, setIcon] = React.useState<IconProp>(faStar);
  const dispatch = useDispatch();
  const theme = useTheme();
  const lights = useLight();

  const { colors } = light.leds;

  const onSubmit = async (color: string, index?: number): Promise<boolean> => {
    let success = true;
    const newColors = makeValidColorArray(color, light.leds.colors, index ?? 0);
    const ax = lights.setColor(
      light.id,
      newColors,
      light.leds.pattern,
      undefined,
    );
    await ax.then(() => {
      success = true;
    });
    await ax.catch(() => {
      success = false;
    });

    return success;
  };

  const onPress = (index: number) => {
    navigation.navigate("color_modal", {
      color: light.leds.colors[index],
      onSubmit,
      index,
    });
  };

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
  }, [light.leds.colors]);

  const styles = StyleSheet.create({
    buttonContainer: {
      flex: 2,
    },
    iconContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
      width: Dimensions.get("window").width - theme.spacing(5) * 2,
      marginHorizontal: theme.spacing(5),
      marginTop: theme.spacing(4),
      flexDirection: "row",
      alignContent: "space-between",
    },
    pressable: { alignSelf: "flex-end", marginRight: 10 },
    text: {
      fontSize: 20,
      fontFamily: "TitilliumWeb-Regular",
      marginLeft: theme.spacing(6),
    },
    list: {
      marginLeft: theme.spacing(7),
    },
  });
  return (
    <>
      {favouriteGradients.length !== 0 ? (
        <>
          <Text style={styles.text}> Favourite Gradients </Text>
          <FavouriteGradientList style={styles.list} id={light.id} />
        </>
      ) : null}
      <Pressable style={styles.pressable} onPress={() => saveColor()}>
        <FontAwesomeIcon color={theme.colors.accent} size={30} icon={icon} />
      </Pressable>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            disabled={!light.isOn}
            mode="contained"
            onPress={() => onPress(0)}
            color={light.leds.colors[0]}
          >
            {light.leds.colors[0]}
          </Button>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            disabled={!light.isOn}
            onPress={() =>
              lights.setColor(light.id, [colors[1], colors[0]], "gradient")
            }
          >
            <FontAwesomeIcon
              icon={faExchangeAlt}
              color={light.isOn ? theme.colors.accent : theme.colors.disabled}
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            disabled={!light.isOn}
            mode="contained"
            onPress={() => onPress(1)}
            color={light.leds.colors[1]}
          >
            {light.leds.colors[1]}
          </Button>
        </View>
      </View>
    </>
  );
}
