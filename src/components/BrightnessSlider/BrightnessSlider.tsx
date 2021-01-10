import * as React from "react";
import Slider from "react-native-slider";
import Axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SET_BRIGHTNESS } from "../../store/actions/types";
import { Light } from "../../interfaces";
import { Store } from "../../store";
import { isEqual } from "lodash";
import { lightEquality } from "../../utils";
import { useTheme } from "react-native-paper";
import tinycolor from "tinycolor2";

export interface SliderProps {
  color: string;
  id: string;
}

export default function BrightnessSlider(props: SliderProps): JSX.Element {
  const { id } = props;
  const theme = useTheme();
  const light: Light = useSelector(
    (state: Store) => state.lights.find((l: Light) => l.uuid === id) as Light,
    (left: Light, right: Light) => !isEqual(left, right)
  );

  const [brightness, setBrightness] = React.useState<number>(light.brightness);

  const dispatch = useDispatch();

  const updateBrightness = (value: number) => {
    Axios.patch(`http://devlight/${light.uuid}/brightness`, {
      brightness: Math.round(value),
    })
      .then(() => {
        dispatch({
          type: SET_BRIGHTNESS,
          brightness: Math.round(value),
          id: light.uuid,
        });
      })
      .catch((err: AxiosError) => {
        console.log(err.response?.data.message);
        setBrightness(light.brightness);
      });
  };

  return (
    <Slider
      minimumTrackTintColor={light.leds.colors[0]}
      minimumValue={1}
      maximumValue={255}
      value={brightness}
      trackStyle={{ height: 5 }}
      thumbStyle={{
        backgroundColor: tinycolor(light.leds.colors[0])
          .spin(180)
          .toHexString(),
        borderRadius: 20,
        height: 30,
        width: 30,
      }}
      onValueChange={(value: number) => setBrightness(value)}
      onSlidingComplete={(value: number) => updateBrightness(value)}
    />
  );
}
