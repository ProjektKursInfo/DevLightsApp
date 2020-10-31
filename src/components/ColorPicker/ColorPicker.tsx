import { useNavigation, useRoute } from "@react-navigation/native";
import Axios from "axios";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import HsvColorPicker from "react-native-hsv-color-picker";
import { Button, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import tinycolor, { ColorFormats } from "tinycolor2";
import { Leds, Light } from "../../interfaces";
import { Store } from "../../store";
import { EDIT_LIGHT_COLOR } from "../../store/actions/types";
import { ledsEquality } from "../../utils";
import { ColorModalScreenRouteProp } from "../Navigation/Navigation";

export default function ColorPicker(): JSX.Element {
  const route = useRoute<ColorModalScreenRouteProp>();
  const leds = useSelector(
    (state: Store) => state.lights.find((l: Light) => l.uuid === route.params.id)?.leds as Leds,
    ledsEquality,
  );
  const [hsv, setHsv] = React.useState<ColorFormats.HSV>(tinycolor(leds.colors[0]).toHsv());
  const [hex, setHex] = React.useState<string>(leds.colors[0]);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const onHueChange = ({ hue }: { hue: number }) => {
    setHsv({ ...hsv, h: hue });
    setHex(tinycolor.fromRatio({ ...hsv, h: hue }).toHexString());
  };

  const onSatValChange = ({ saturation, value }: { saturation: number, value: number }) => {
    setHsv({ ...hsv, s: saturation, v: value });
    setHex(tinycolor.fromRatio({ ...hsv, s: saturation, v: value }).toHexString());
  };
  const onSubmit = (): void => {
    Axios.patch(`http://${ip}/colors/${route.params.id}`, {
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
    <View
      style={styles.container}
    >
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
