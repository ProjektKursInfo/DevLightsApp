import { Light } from "@devlights/types";
import { faLightbulb as regular } from "@fortawesome/free-regular-svg-icons";
import { faLightbulb, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { map } from "lodash";
import React from "react";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import useLight from "../../hooks/useLight";
import { Store } from "../../store";
import { isOnEquality } from "../../utils";
import Icon from "../Icon";

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

  const getSwitchedOns = (): boolean => {
    const ons = map(lights, "isOn");
    if (ons.includes(false)) return false;
    return true;
  };
  const [icon, setIcon] = React.useState<IconDefinition>(
    getSwitchedOns() ? faLightbulb : regular,
  );

  React.useEffect(() => {
    setIcon(getSwitchedOns() ? faLightbulb : regular);
  }, [getSwitchedOns()]);

  const onPress = (status: boolean) => {
    setIcon(status ? faLightbulb : regular);
    if (onBulbPress) onBulbPress();
    lights.forEach((l: Light) => {
      if (l.isOn !== status) {
        light
          .setStatus(l.id, status)
          .catch(() => setIcon(getSwitchedOns() ? faLightbulb : regular));
      }
    });
  };
  return (
    <Icon
      position="right"
      color={theme.colors.accent}
      icon={icon}
      onPress={() => onPress(!getSwitchedOns())}
    />
  );
}
