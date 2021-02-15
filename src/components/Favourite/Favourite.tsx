import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Lottie from "lottie-react-native";
import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Modalize } from "react-native-modalize";
import { Divider, List, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { LightsStackParamList } from "../../interfaces/types";
import { Store } from "../../store";
import {
  removeFavouriteColor,
  removeFavouriteGradient
} from "../../store/actions/favourites";
import { Gradient } from "../../store/types/favouriteGradients";
import { favouriteGradientsEquality, favouritesEquality } from "../../utils";
import Circle from "../Circle";
import { ApplyDialog } from "./ApplyDialog/ApplyDialog";

export function Color(props: {
  colors: string[];
  delete: () => void;
}): JSX.Element {
  const { colors } = props;
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: { width: "100%" },
    pressable: { alignSelf: "center" },
  });
  const modalizeRef = React.useRef<Modalize>(null);
  return (
    <>
      <List.Item
        title={colors[0] + (colors[1] ? ` + ${colors[1]}` : "")}
        onPress={() => modalizeRef?.current?.open()}
        style={styles.container}
        left={() => <Circle colors={colors} />}
        right={() => (
          <TouchableOpacity style={styles.pressable} onPress={props.delete}>
            <FontAwesomeIcon
              size={26}
              icon={faTrash}
              color={theme.colors.accent}
            />
          </TouchableOpacity>
        )}
      />
      <ApplyDialog
        onConfirm={() => modalizeRef.current?.close()}
        colors={colors}
        ref={modalizeRef}
      />
    </>
  );
}

export type FavouriteScreenNavigationProp = StackNavigationProp<
LightsStackParamList,
"favourite"
>;

export type FavouriteScreenRouteProp = RouteProp<
LightsStackParamList,
"favourite"
>;

export default function Favourite(): JSX.Element {
  const colors: string[] = useSelector(
    (state: Store) => state.favouriteColors,
    favouritesEquality,
  );
  const gradients: Gradient[] = useSelector(
    (state: Store) => state.favouriteGradients,
    favouriteGradientsEquality,
  );
  const theme = useTheme();
  const dispatch = useDispatch();
  const styles = StyleSheet.create({
    container: { alignSelf: "center", alignItems: "center", marginTop: 10 },
    text: {
      fontSize: 18,
      color: theme.colors.text,
      textAlign: "left",
      margin: theme.spacing(4),
    },
  });
  if (colors.length === 0 && gradients.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Lottie
          autoPlay
          hardwareAccelerationAndroid
          autoSize
          loop={false}
          // eslint-disable-next-line global-require
          source={require("../../../assets/animations/favourite.json")}
        />
        <Text style={styles.text}>You haven`t saved any favourites yet</Text>
      </ScrollView>
    );
  }

  // Colors === 0 and gradients should be not null
  if (colors.length === 0) {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={{ color: theme.colors.text, margin: theme.spacing(3) }}>
            You haven`t saved any colors yet
          </Text>
        </View>
        <Divider />
        <Text style={styles.text}>Gradients</Text>
        {gradients.map((g: Gradient) => {
          const array = [g.start, g.end];
          return (
            <Color
              key={g.start + g.end}
              delete={() => dispatch(removeFavouriteGradient(g))}
              colors={array}
            />
          );
        })}
      </ScrollView>
    );
  }

  // Gradients === 0 and colors should be not null
  if (gradients.length === 0) {
    return (
      <ScrollView>
        <View style={{ marginTop: theme.spacing(4) }}>
          <Text style={styles.text}>Colors</Text>
          {colors.map((fav: string) => (
            <Color
              key={fav}
              delete={() => dispatch(removeFavouriteColor(fav))}
              colors={[fav]}
            />
          ))}
        </View>
        <Divider />
        <View style={styles.container}>
          <Text style={{ color: theme.colors.text, margin: theme.spacing(3) }}>
            You haven`t saved any gradients yet
          </Text>
        </View>
      </ScrollView>
    );
  }

  // Default export if nothing is null.
  return (
    <ScrollView>
      <Text style={styles.text}> Colors</Text>
      {colors.map((fav: string) => (
        <Color
          key={fav}
          delete={() => dispatch(removeFavouriteColor(fav))}
          colors={[fav]}
        />
      ))}
      <Divider />
      <Text style={styles.text}>Gradients</Text>
      {gradients.map((g: Gradient) => {
        const array = [g.start, g.end];
        return (
          <Color
            key={g.start + g.end}
            delete={() => dispatch(removeFavouriteGradient(g))}
            colors={array}
          />
        );
      })}
    </ScrollView>
  );
}
