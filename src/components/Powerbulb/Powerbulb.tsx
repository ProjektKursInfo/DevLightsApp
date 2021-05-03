import { Light } from "@devlights/types";
import { faLightbulb as regular } from "@fortawesome/free-regular-svg-icons";
import { faLightbulb, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { map } from "lodash";
import React from "react";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { LightResponse } from "../../interfaces/types";
import { Store } from "../../store";
import { setLight } from "../../store/actions/lights";
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
  const dispatch = useDispatch();
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
        const ax = axios.patch(`/lights/${l.id}/${status ? "on" : "off"}`);
        ax.then((res: LightResponse) =>
          dispatch(setLight(l.id, res.data.object)),
        ).catch(() => setIcon(getSwitchedOns() ? faLightbulb : regular));
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
