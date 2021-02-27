/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Light } from "@devlights/types";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as fullstar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AxiosResponse } from "axios";
import { isEqual } from "lodash";
import * as React from "react";
import { Pressable, StyleSheet, View } from "react-native";
// @ts-ignore
import HsvColorPicker from "react-native-hsv-color-picker";
import { Button, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import tinycolor, { ColorFormats } from "tinycolor2";
import useLight from "../../hooks/useLight";
import { LightsStackParamList } from "../../interfaces/types";
import { Store } from "../../store";
import {
  addFavouriteColor,
  removeFavouriteColor,
} from "../../store/actions/favourites";
import { makeValidColorArray } from "../../utils";
import FavouriteList from "../FavouriteList/FavouriteList";

export type ColorModalScreenNavigationProp = StackNavigationProp<
LightsStackParamList,
"color_modal"
>;

export type ColorModalScreenRouteProp = RouteProp<
LightsStackParamList,
"color_modal"
>;

export default function ColorPicker(): JSX.Element {
  const route = useRoute<ColorModalScreenRouteProp>();
  const { id, index } = route.params;
  const lights = useLight();
  const light: Light = useSelector(
    (state: Store) => state.lights.find((l: Light) => l.id === id) as Light,
    (left: Light, right: Light) => !isEqual(left.leds, right.leds),
  );
  const favouriteColors: string[] = useSelector(
    (state: Store) => state.favouriteColors,
    isEqual,
  );
  const [hsv, setHsv] = React.useState<ColorFormats.HSV>(
    tinycolor(light.leds.colors[index]).toHsv(),
  );
  const [icon, setIcon] = React.useState<IconProp>(faStar);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { colors } = theme;
  const saveColor = () => {
    if (favouriteColors.includes(tinycolor.fromRatio(hsv).toHexString())) {
      dispatch(removeFavouriteColor(tinycolor.fromRatio(hsv).toHexString()));
      setIcon(faStar);
    } else {
      dispatch(addFavouriteColor(tinycolor.fromRatio(hsv).toHexString()));
      setIcon(fullstar);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    button: { marginTop: 20 },
    icon: { marginRight: 20, marginTop: 15 },
  });

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable style={styles.icon} onPress={() => saveColor()}>
          <FontAwesomeIcon color={theme.colors.accent} size={30} icon={icon} />
        </Pressable>
      ),
    });
  }, [icon]);

  React.useEffect(() => {
    if (favouriteColors.includes(tinycolor.fromRatio(hsv).toHexString())) {
      setIcon(fullstar);
    } else {
      setIcon(faStar);
    }
  }, [hsv]);

  const onSatValChange = ({saturation, value} : {saturation: number, value: number}) => {
    setHsv({...hsv, s: saturation, v: value});
  };

  const onPress = (prop: string) => {
    const { h, s, v } = tinycolor.fromRatio(prop).toHsv();
    setHsv({ h, s, v });
    if (icon === faStar) setIcon(fullstar);
  };

  const onSubmit = async () => {
    const oldColor = light.leds.colors[index];
    const newColors = makeValidColorArray(
      tinycolor.fromRatio(hsv).toHexString(),
      light.leds.colors,
      index,
    );
    const ax = lights.setColor(id, newColors, light.leds.pattern);
    ax.then((response: AxiosResponse) => {
      if (response.status === 200) {
        navigation.goBack();
      }
    });
    ax.catch(() => {
      setHsv(tinycolor(oldColor).toHsv());
    });
  };
  return (
    <View style={styles.container}>
      <FavouriteList onPress={onPress} />
      <HsvColorPicker
        huePickerHue={hsv.h}
        huePickerSliderSize={30}
        satValPickerHue={hsv.h}
        satValPickerSaturation={hsv.s}
        satValPickerValue={hsv.v}
        satValPickerSize={270}
        satValPickerSliderSize={30}
        onHuePickerDragMove={({ hue }: { hue: number }) => setHsv({ ...hsv, h: hue })}
        onHuePickerPress={({ hue }: { hue: number }) => setHsv({ ...hsv, h: hue })}
        onSatValPickerDragMove={onSatValChange}
        onSatValPickerPress={onSatValChange}
      />
      <Text>
        Current color:
        {tinycolor.fromRatio(hsv).toHexString()}
      </Text>
      <Button
        disabled={
          tinycolor.fromRatio(hsv).toHexString() === light.leds.colors[index]
        }
        style={styles.button}
        color={
          tinycolor.fromRatio(hsv).toHexString() !== ""
            ? tinycolor.fromRatio(hsv).toHexString()
            : light.leds.colors[0]
        }
        onPress={onSubmit}
        mode="contained"
      >
        Save color
      </Button>
    </View>
  );
}
