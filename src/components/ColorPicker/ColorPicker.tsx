import { useNavigation, useRoute } from "@react-navigation/native";
import Axios, { AxiosResponse } from "axios";
import * as React from "react";
import { View } from "react-native";
import HsvColorPicker from "react-native-hsv-color-picker";
import { Button, Text } from "react-native-paper";
import { useStore } from "react-redux";
import tinycolor, { ColorFormats } from "tinycolor2";
import { ColorModalScreenRouteProp } from "../Navigation/Navigation";

export default function ColorPicker() {
  const [h, setH] = React.useState<number>(0);
  const [s, setS] = React.useState<number>(0);
  const [v, setV] = React.useState<number>(1);
  const store = useStore();
  const [hex, setHex] = React.useState<string>("");

  const route = useRoute<ColorModalScreenRouteProp>();
  React.useEffect(() => {
    setHex(route.params.colors[0]);
    const hsv: ColorFormats.HSVA = tinycolor(route.params.colors[0]).toHsv();
    setH(hsv.h);
    setS(hsv.s);
    setV(hsv.v);
  }, []);

  const onSatValPickerChange = ({ saturation, value }): void => {
    setS(saturation);
    setV(value);
    getHex();
  };

  const onHuePickerChange = ({ hue }): void => {
    setH(hue);
    getHex();
  };

  const getHex = (): void => {
    const color = tinycolor.fromRatio({ h: h, s: s, v: v }).toHexString();
    setHex(color);
  };

  const navigation = useNavigation();

  const onSubmit = (): void => {
    Axios.patch(`http://${ip}/settings/colors/${route.params.id}`, {
      colors: [hex],
      pattern: route.params.pattern,
    }).then((res: AxiosResponse) => {
      console.log(res.data);
      store.dispatch({
        type: "EDIT_LIGHT_COLOR",
        id: route.params.id,
        colors: [hex],
      });
      navigation.goBack();
    });
  };

  // settings/count/id

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#2f2f2f",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <HsvColorPicker
        huePickerHue={h}
        onHuePickerDragMove={onHuePickerChange}
        onHuePickerPress={onHuePickerChange}
        satValPickerHue={h}
        satValPickerSaturation={s}
        satValPickerValue={v}
        satValPickerSize={270}
        huePickerSliderSize={30}
        satValPickerSliderSize={30}
        onSatValPickerDragMove={onSatValPickerChange}
        onSatValPickerPress={onSatValPickerChange}
      />
      <Text>Current color: {hex}</Text>
      <Button
        style={{ marginTop: 20 }}
        color={hex != "" ? hex : route.params.colors[0]}
        onPress={onSubmit}
        mode="contained"
      >
        Save color
      </Button>
    </View>
  );
}
