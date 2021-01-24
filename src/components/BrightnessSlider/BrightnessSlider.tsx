import { isEqual } from "lodash";
import * as React from "react";
import { StyleSheet } from "react-native";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Slider from "react-native-slider";
import { useSelector } from "react-redux";
import tinycolor from "tinycolor2";
import useLight from "../../hooks/useLight";
import { Light } from "../../interfaces";
import { Store } from "../../store";

export interface SliderProps {
  color: string;
  id: string;
}

export default function BrightnessSlider(props: SliderProps): JSX.Element {
  const { id } = props;
  const light: Light = useSelector(
    (state: Store) => state.lights.find((l: Light) => l.id === id) as Light,
    (left: Light, right: Light) => !isEqual(left, right),
  );

  const [brightness, setBrightness] = React.useState<number>(light.brightness);
  const lights = useLight();
  const styles = StyleSheet.create({
    trackStyle: { height: 5 },
    thumbStyle: {
      backgroundColor: tinycolor(light.leds.colors[0]).spin(180).toHexString(),
      borderRadius: 20,
      height: 30,
      width: 30,
    },
  });
  return (
    <Slider
      minimumTrackTintColor={light.leds.colors[0]}
      minimumValue={1}
      maximumValue={255}
      value={brightness}
      trackStyle={styles.trackStyle}
      thumbStyle={styles.thumbStyle}
      onValueChange={(value: number) => setBrightness(value)}
      onSlidingComplete={(value: number) => (
        lights.setBrightness(light.id, value).catch(() => {
          setBrightness(light.brightness);
        })
      )}
    />
  );
}
