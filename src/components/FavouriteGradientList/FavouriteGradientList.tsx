import React from "react";
import { useSelector } from "react-redux";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { isEqual } from "lodash";
import Circle from "../Circle";
import { Store } from "../../store";
import { Gradient } from "../../store/types/favouriteGradients";
import useLight from "../../hooks/useLight";

export interface FavouriteGradientListProps {
  id: string,
  style?: StyleProp<ViewStyle>
}

export default function FavouriteGradientList(props: FavouriteGradientListProps): JSX.Element {
  const {style, id} = props;
  const light = useLight();
  const favouriteGradients = useSelector(
    (state: Store) => state.favouriteGradients,
    (l: Gradient[], r: Gradient[]) => isEqual(l, r),
  );
  return (
    <View style={style}>
      {favouriteGradients.map((g: Gradient) => (
        <Pressable onPress={() => light.setColor(id, [g.start, g.end], "gradient")}>
          <Circle key={g.start + g.end} colors={[g.start, g.end]} />
        </Pressable>
      ))}
    </View>
  );
}
