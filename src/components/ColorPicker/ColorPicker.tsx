import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as fullstar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import Axios, { AxiosError, AxiosResponse } from "axios";
import { isEqual } from "lodash";
import * as React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import HsvColorPicker from "react-native-hsv-color-picker";
import { Button, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import tinycolor, { ColorFormats } from "tinycolor2";
import useLight from "../../hooks/useLight";
import useSnackbar from "../../hooks/useSnackbar";
import { Leds, Light } from "../../interfaces";
import { Store } from "../../store";
import {
  ADD_FAVOURITE,
  EDIT_LIGHT_COLOR,
  REMOVE_FAVOURITE,
} from "../../store/actions/types";
import { ledsEquality, makeValidColorArray } from "../../utils";
import FavouriteList from "../FavouriteList/FavouriteList";
import { ColorModalScreenRouteProp } from "../Navigation/Navigation";

export default function ColorPicker(): JSX.Element {
  const route = useRoute<ColorModalScreenRouteProp>();
  const lights = useLight();
  const light = useSelector(
    (state: Store) =>
      state.lights.find((l: Light) => l.uuid === route.params.id) as Light,
    (left: Light, right: Light) => !isEqual(left.leds, right.leds)
  );
  const favourites: string[] = useSelector(
    (state: Store) => state.favourites,
    isEqual,
  );
  const [hsv, setHsv] = React.useState<ColorFormats.HSV>(
    tinycolor(light.leds.colors[route.params.index]).toHsv()
  );
  const [icon, setIcon] = React.useState<IconProp>(faStar);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const saveColor = () => {
    if (favourites.includes(tinycolor.fromRatio(hsv).toHexString())) {
      dispatch({
        type: REMOVE_FAVOURITE,
        favourite: tinycolor.fromRatio(hsv).toHexString(),
      });
      setIcon(faStar);
    } else {
      dispatch({
        type: ADD_FAVOURITE,
        favourite: tinycolor.fromRatio(hsv).toHexString(),
      });
      setIcon(fullstar);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#2f2f2f",
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

  const onPress = (prop: string) => {
    const { h, s, v } = tinycolor.fromRatio(prop).toHsv();
    setHsv({ h, s, v });
    if (icon === faStar) setIcon(fullstar);
  };

  const onHueChange = ({ hue }: { hue: number }) => {
    setHsv({ ...hsv, h: hue });
    if (
      favourites.includes(tinycolor.fromRatio({ ...hsv, h: hue }).toHexString())
    ) {
      setIcon(fullstar);
    } else if (icon === fullstar) setIcon(faStar);
  };

  const onSatValChange = ({
    saturation,
    value,
  }: {
    saturation: number;
    value: number;
  }) => {
    setHsv({ ...hsv, s: saturation, v: value });
    if (
      favourites.includes(
        tinycolor.fromRatio({ ...hsv, s: saturation, v: value }).toHexString()
      )
    ) {
      setIcon(fullstar);
    } else if (icon === fullstar) setIcon(faStar);
  };
  const onSubmit = (): void => {
    const colors = makeValidColorArray(
      tinycolor.fromRatio(hsv).toHexString(),
      light.leds.colors,
      route.params.index,
    );
    const ax = lights.setColor(route.params.id, colors, light.leds.pattern);
    ax.then((response: AxiosResponse) => {
      if (response.status === 200) {
        navigation.goBack();
      }
    });/* 
    ax.catch(() => {
      console.log(light);
      console.log(light.leds.colors[route.params.index]);
      setHsv(tinycolor(light.leds.colors[route.params.index]).toHsv());
    }); */
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
        onHuePickerDragMove={onHueChange}
        onHuePickerPress={onHueChange}
        onSatValPickerDragMove={onSatValChange}
        onSatValPickerPress={onSatValChange}
      />
      <Text>
        Current color:
        {tinycolor.fromRatio(hsv).toHexString()}
      </Text>
      <Button
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
