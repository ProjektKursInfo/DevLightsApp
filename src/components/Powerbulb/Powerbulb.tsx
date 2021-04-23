import { Light } from "@devlights/types";
import { faLightbulb as regular } from "@fortawesome/free-regular-svg-icons";
import { faLightbulb, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { isEqual, map } from "lodash";
import React from "react";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import useLight from "../../hooks/useLight";
import { Store } from "../../store";
import { isOnEquality } from "../../utils";
import Icon from "../Icon";

/* interface PowerBulbProps {
  id: string;
  onBulbPress?: () => void;
}
export default function PowerBulb(props: PowerBulbProps): JSX.Element {
  const { id, style } = props;
  const light = useSelector(
    (state: Store) => state.lights.find((l: Light) => l.id === id) as Light,
    (left: Light, right: Light) => isEqual(left.isOn, right.isOn),
  );
  const theme = useTheme();
  const lights = useLight();
  const [icon, setIcon] = React.useState<IconDefinition>(
    light.isOn ? faLightbulb : regular,
  );

  React.useEffect(() => {
    setIcon(light.isOn ? faLightbulb : regular);
  }, [light.isOn]);

  const onPress = () => {
    const ax = lights.setStatus(light.id, !light.isOn);
    ax.then(() => {
      setIcon(light.isOn ? regular : faLightbulb);
    });
    ax.catch(() => {
      setIcon(light.isOn ? faLightbulb : regular);
    });
    setIcon(light.isOn ? regular : faLightbulb);
    if (props.onBulbPress) props.onBulbPress();
  };
  return (
    <Icon
      position="right"
      color={theme.colors.accent}
      icon={icon}
      onPress={onPress}
    />
  );
} */

interface PowerBulbProps {
  ids: string[];
  onBulbPress?: () => void;
}

export default function PowerBulb(props: PowerBulbProps): JSX.Element {
  const { ids, onBulbPress } = props;
  const lights = useSelector(
    (state: Store) => state.lights.filter((l) => ids.includes(l.id)),
    (l: Light[], r: Light[]) => isOnEquality(l, r),
  );
  const light = useLight();
  const theme = useTheme();

  const getIsOn = (): boolean => {
    const ons = map(lights, "isOn");
    if (ons.includes(false)) return false;
    return true;
  };
  const [icon, setIcon] = React.useState<IconDefinition>(
    getIsOn() ? faLightbulb : regular,
  );

  React.useEffect(() => {
    setIcon(getIsOn() ? faLightbulb : regular);
  }, [getIsOn()]);

  const onPress = (status: boolean) => {
    setIcon(status ? faLightbulb : regular);
    if (onBulbPress) onBulbPress();
    lights.forEach((l: Light) => {
      if (l.isOn !== status)
        light
          .setStatus(l.id, status)
          .catch(() => setIcon(getIsOn() ? faLightbulb : regular));
    });
  };
  return (
    <Icon
      position="right"
      color={theme.colors.accent}
      icon={icon}
      onPress={() => onPress(!getIsOn())}
    />
  );
}
