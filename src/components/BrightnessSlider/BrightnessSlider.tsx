import * as React from "react";
import Slider from "@react-native-community/slider";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { SET_BRIGHTNESS } from "../../store/actions/types";
import { Light } from "../../interfaces";

export interface SliderProps {
  light: Light;
}

export default function BrightnessSlider(props: SliderProps) : JSX.Element {
  const { light } = props;
  const [brightness, setBrightness] = React.useState<number>(light.brightness);

  const dispatch = useDispatch();

  const updateBrightness = (value: number) => {
    Axios.patch(`http://devlight/${light.uuid}/brightness`, {
      brightness: Math.round(value),
    })
      .then(() => {
        dispatch({type: SET_BRIGHTNESS, brightness: Math.round(value), id: light.uuid});
        console.log(light.brightness);
      })
      .catch(() => {
        setBrightness(light.brightness);
      });
  };

  return (
    <Slider
      minimumTrackTintColor={light.leds.colors[0]}
      minimumValue={1}
      maximumValue={255}
      value={brightness}
      onValueChange={(value: number) => setBrightness(value)}
      onSlidingComplete={(value: number) => updateBrightness(value)}
    />
  );
}
