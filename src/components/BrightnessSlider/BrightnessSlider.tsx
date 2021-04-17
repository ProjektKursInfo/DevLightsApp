import { isEqual } from "lodash";
import * as React from "react";
import { StyleSheet } from "react-native";
// @ts-ignore
import Slider from "react-native-slider";
import { useSelector } from "react-redux";
import tinycolor from "tinycolor2";
import { Light } from "@devlights/types";
import { useTheme } from "react-native-paper";
import useLight from "../../hooks/useLight";
import { Store } from "../../store";

export interface SliderProps {
  color: string;
  ids: string[];
}

export default function BrightnessSlider(props: SliderProps): JSX.Element {
  const { ids } = props;
  const light: Light = useSelector(
    (state: Store) => state.lights.find((l: Light) => l.id === ids[0]) as Light,
    (left: Light, right: Light) => !isEqual(left, right),
  );

  const [brightness, setBrightness] = React.useState<number>(light.brightness);
  const lights = useLight();
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
  return (
    <Slider
      minimumTrackTintColor={
        light.isOn ? light.leds.colors[0] : theme.colors.disabled
      }
      minimumValue={1}
      maximumValue={255}
      value={brightness}
      trackStyle={styles.trackStyle}
      thumbStyle={styles.thumbStyle}
      onValueChange={(value: number) => setBrightness(value)}
      onSlidingComplete={(value: number) =>
        ids.forEach((id: string) =>
          lights.setBrightness(id, value).catch(() => {
            setBrightness(light.brightness);
          }),
        )
      }
    />
  );
}
