import React from "react";
import { useSelector } from "react-redux";
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { isEqual } from "lodash";
import { useTheme } from "react-native-paper";
import Circle from "../Circle";
import { Store } from "../../store";
import { Gradient } from "../../store/types/favouriteGradients";
import useLight from "../../hooks/useLight";

export interface FavouriteGradientListProps {
  id: string;
  style?: StyleProp<ViewStyle>;
}

export default function FavouriteGradientList(
  props: FavouriteGradientListProps,
): JSX.Element {
  const { style, id } = props;
  const theme = useTheme();
  const light = useLight();
  const favouriteGradients = useSelector(
    (state: Store) => state.favouriteGradients,
    (l: Gradient[], r: Gradient[]) => isEqual(l, r),
  );

  const styles = StyleSheet.create({
    container: StyleSheet.flatten([
      style,
      {
        flexDirection: "row",
      },
    ]),
    pressable: {
      margin: theme.spacing(2),
    },
  });
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {favouriteGradients.map((g: Gradient) => (
          <Pressable
            style={styles.pressable}
            onPress={() => light.setColor(id, [g.start, g.end], "gradient")}
          >
            <Circle key={g.start + g.end} colors={[g.start, g.end]} />
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}
