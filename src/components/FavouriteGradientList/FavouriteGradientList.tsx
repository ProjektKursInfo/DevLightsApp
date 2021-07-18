import { isEqual } from "lodash";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import { Store } from "../../store";
import { Gradient } from "../../store/types/favouriteGradients";
import Circle from "../Circle";

export interface FavouriteGradientListProps {
  onPress: (colors: string[]) => Promise<any>;
  style?: StyleProp<ViewStyle>;
}

export default function FavouriteGradientList(
  props: FavouriteGradientListProps,
): JSX.Element {
  const { style } = props;
  const theme = useTheme();
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
            key={`${g.start + g.end}_press`}
            style={styles.pressable}
            onPress={() => props.onPress([g.start, g.end])}
          >
            <Circle key={g.start + g.end} colors={[g.start, g.end]} />
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}
