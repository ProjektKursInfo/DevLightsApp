import { FontawesomeObject, IconProp } from "@fortawesome/fontawesome-svg-core";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as fullstar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import Axios, { AxiosError } from "axios";
import * as React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import HsvColorPicker from "react-native-hsv-color-picker";
import { Button, Text } from "react-native-paper";
import { useDispatch, useSelector, useStore } from "react-redux";
import tinycolor, { ColorFormats } from "tinycolor2";
import { Leds, Light } from "../../interfaces";
import { Store } from "../../store";
import { ADD_FAVOURITE, EDIT_LIGHT_COLOR, REMOVE_FAVOURITE } from "../../store/actions/types";
import { ledsEquality } from "../../utils";
import FavouriteList from "../FavouriteList/FavouriteList";
import { ColorModalScreenRouteProp } from "../Navigation/Navigation";

export default function ColorPicker(): JSX.Element {
  const route = useRoute<ColorModalScreenRouteProp>();
  const leds = useSelector(
    (state: Store) =>
      state.lights.find((l: Light) => l.uuid === route.params.id)?.leds as Leds,
    ledsEquality,
  );
  const [hsv, setHsv] = React.useState<ColorFormats.HSV>(
    tinycolor(leds.colors[0]).toHsv()
  );
  const [hex, setHex] = React.useState<string>(leds.colors[0]);
  const [icon, setIcon] = React.useState<IconProp>(faStar);
  const navigation = useNavigation();
  const store = useStore();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const saveColor = () => {
      if (store.getState().favourites.includes(hex)) {
        dispatch({type: REMOVE_FAVOURITE, favourite: hex});
        setIcon(faStar);
      } else {
        dispatch({type: ADD_FAVOURITE, favourite: hex});
        setIcon(fullstar);
      }
    };
    navigation.setOptions({
      headerRight: () => (
        <Pressable style={{marginRight: 10}} onPress={() => saveColor()}>
          <FontAwesomeIcon color="#fff" size={25} icon={icon} />
        </Pressable>
      ),
    });
  }, [icon]);

  const onPress = (prop: string) => {
    const {h, s, v} = tinycolor.fromRatio(prop).toHsv();
    setHsv({h, s, v});
    setHex(prop);
    if (icon === faStar) setIcon(fullstar);
  };

  const onHueChange = ({ hue }: { hue: number }) => {
    setHsv({ ...hsv, h: hue });
    setHex(tinycolor.fromRatio({ ...hsv, h: hue }).toHexString());
    if (store.getState().favourites.includes(hex)) setIcon(fullstar);
    else if (icon === fullstar) setIcon(faStar);
  };

  const onSatValChange = ({
    saturation,
    value,
  }: {
    saturation: number;
    value: number;
  }) => {
    setHsv({ ...hsv, s: saturation, v: value });
    setHex(
      tinycolor.fromRatio({ ...hsv, s: saturation, v: value }).toHexString()
    );
    if (store.getState().favourites.includes(hex)) setIcon(fullstar);
    else if (icon === fullstar) setIcon(faStar);
  };
  const onSubmit = (): void => {
    Axios.patch(`http://devlight/${route.params.id}/color`, {
      colors: [hex],
      pattern: leds.pattern,
    }).then(() => {
      dispatch({
        type: EDIT_LIGHT_COLOR,
        id: route.params.id,
        colors: [hex],
      });
      navigation.goBack();
    });
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#2f2f2f",
      alignItems: "center",
      justifyContent: "center",
    },
    button: { marginTop: 20 },
  });
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
        {hex}
      </Text>
      <Button
        style={styles.button}
        color={hex !== "" ? hex : leds.colors[0]}
        onPress={onSubmit}
        mode="contained"
      >
        Save color
      </Button>
    </View>
  );
}
