import axios from "axios";
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
import { useDispatch, useSelector } from "react-redux";
import { LightResponse } from "../../interfaces/types";
import { Store } from "../../store";
import { setLight } from "../../store/actions/lights";
import { Gradient } from "../../store/types/favouriteGradients";
import Circle from "../Circle";

export interface FavouriteGradientListProps {
  id: string;
  style?: StyleProp<ViewStyle>;
}

export default function FavouriteGradientList(
  props: FavouriteGradientListProps,
): JSX.Element {
  const { style, id } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
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
  const setColor = (colors: string[]) => {
    axios
      .patch(`/lights/${id}`, { colors, pattern: "gradient" })
      .then((res: LightResponse) => dispatch(setLight(id, res.data.object)));
  };
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {favouriteGradients.map((g: Gradient) => (
          <Pressable
            style={styles.pressable}
            onPress={() => setColor([g.start, g.end])}
          >
            <Circle key={g.start + g.end} colors={[g.start, g.end]} />
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}
