import React from "react";
import { faLightbulb, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as regular } from "@fortawesome/free-regular-svg-icons";
import { isEqual } from "lodash";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Light } from "@devlights/types";
import useLight from "../../hooks/useLight";
import { Store } from "../../store";

interface PowerBulbProps {
  id: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
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

  const onPress = async() => {
    console.log("pres");
    const ax = lights.setStatus(light.id, !light.isOn);
    ax.then(() => {
      setIcon(light.isOn ? regular : faLightbulb);
    });
    ax.catch(() => {
      setIcon(light.isOn ? faLightbulb : regular);
     
    });
    setIcon(light.isOn ? regular : faLightbulb);
    setTimeout(() => props.onPress ? props.onPress() : null, 10000);
  };
  return (
    <Pressable onPress={onPress} style={style}>
      <FontAwesomeIcon
        size={30}
        color={theme.colors.accent}
        icon={icon}
        {...props}
      />
    </Pressable>
  );
}
