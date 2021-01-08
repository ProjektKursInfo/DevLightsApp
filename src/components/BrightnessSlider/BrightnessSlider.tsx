import * as React from "react";
import Slider from "@react-native-community/slider";
import Axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SET_BRIGHTNESS } from "../../store/actions/types";
import { Light } from "../../interfaces";
import { Store } from "../../store";
import { isEqual } from "lodash";
import { lightEquality } from "../../utils";

export interface SliderProps {
  color: string;
  id: string;
}

export default function BrightnessSlider(props: SliderProps): JSX.Element {
  const { id } = props;
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
      onValueChange={(value: number) => setBrightness(value)}
      onSlidingComplete={(value: number) => updateBrightness(value)}
    />
  );
}
