import { Light } from "@devlights/types";
import axios from "axios";
import { filter, isEqual, some } from "lodash";
import * as React from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
// @ts-ignore
import Slider from "react-native-slider";
import { useDispatch, useSelector } from "react-redux";
import tinycolor from "tinycolor2";
import { LightResponse } from "../../interfaces/types";
import { Store } from "../../store";
import { setLight } from "../../store/actions/lights";

export interface SliderProps {
  color: string;
  ids: string[];
}

export default function BrightnessSlider(props: SliderProps): JSX.Element {
  const { ids } = props;
  const dispatch = useDispatch();
  const light: Light = useSelector(
    (state: Store) => state.lights.find((l: Light) => l.id === ids[0]) as Light,
    (left: Light, right: Light) => !isEqual(left, right),
  );

  const realLights: Light[] = useSelector(
    (state: Store) =>
      filter(state.lights, (l: Light) => ids.includes(l.id)) as Light[],
    (left: Light[], right: Light[]) => !isEqual(left, right),
  );

  const [brightness, setBrightness] = React.useState<number>(light.brightness);
  const theme = useTheme();
  const styles = StyleSheet.create({
    trackStyle: { height: 5 },
    thumbStyle: {
      backgroundColor: tinycolor(light.leds.colors[0]).spin(180).toHexString(),
      borderRadius: 20,
      height: 30,
      width: 30,
    },
  });

  const disabled =
    some(realLights, (nLight: Light) => nLight.leds.pattern === "custom") ||
    some(realLights, (nLight: Light) => !nLight.isOn);

  const updateBrightness = (value: number) => {
    realLights.forEach((pLight: Light) => {
      const ax = axios.patch(`/lights/${pLight.id}/brightness`, {
        brightness: value,
      });
      ax.then((res: LightResponse) =>
        dispatch(setLight(pLight.id, res.data.object)),
      );
      ax.catch(() => setBrightness(pLight.brightness));
    });
  };
  return (
    <Slider
      minimumTrackTintColor={
        !disabled ? light.leds.colors[0] : theme.colors.disabled
      }
      disabled={disabled}
      minimumValue={1}
      maximumValue={255}
      value={brightness}
      trackStyle={styles.trackStyle}
      thumbStyle={styles.thumbStyle}
      onValueChange={(value: number) => setBrightness(value)}
      onSlidingComplete={(value: number) => updateBrightness(value)}
    />
  );
}
