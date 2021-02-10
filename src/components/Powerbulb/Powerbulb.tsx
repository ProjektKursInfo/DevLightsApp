import React from "react";
import { faLightbulb, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as regular } from "@fortawesome/free-regular-svg-icons";
import { isEqual } from "lodash";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Pressable, StyleSheet } from "react-native";
import useLight from "../../hooks/useLight";
import Light from "@bit/devlights.types.lightinterface";
import { Store } from "../../store";

interface PowerBulbProps {
  id: string;
}
export default function PowerBulb(props: PowerBulbProps): JSX.Element {
  const { id } = props;
  const light = useSelector(
    (state: Store) => state.lights.find((l: Light) => l.id === id) as Light,
    (left: Light, right: Light) => isEqual(left.isOn, right.isOn)
  );
  const theme = useTheme();
  const lights = useLight();
  const [icon, setIcon] = React.useState<IconDefinition>(
    light.isOn ? faLightbulb : regular
  );

  React.useEffect(() => {
    setIcon(light.isOn ? faLightbulb : regular);
  }, [light.isOn]);
  const styles = StyleSheet.create({
    pressable: { marginRight: 30, marginTop: 15, alignSelf: "center" },
  });
  return (
    <Pressable
      onPress={() => {
        lights.setStatus(light.id, !light.isOn);
        setIcon(light.isOn ? regular : faLightbulb);
      }}
      style={styles.pressable}
    >
      <FontAwesomeIcon
        size={30}
        color={theme.colors.accent}
        icon={icon}
        {...props}
      />
    </Pressable>
  );
}
