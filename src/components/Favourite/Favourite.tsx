/* eslint-disable no-nested-ternary */
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { LinearGradient } from "expo-linear-gradient";
import Lottie from "lottie-react-native";
import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { Divider, List, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../../store";
import {
  removeFavouriteColor,
  removeFavouriteGradient,
} from "../../store/actions/favourites";
import { Gradient } from "../../store/types/favouriteGradients";
import { favouriteGradientsEquality, favouritesEquality } from "../../utils";
import { ApplyDialog } from "./ApplyDialog/ApplyDialog";

export function Circle(props: { colors: string[] }): JSX.Element {
  const { colors } = props;
  const styles = StyleSheet.create({
    root: {
      flexDirection: "row",
    },
    gradient: { borderRadius: 100, height: 40, width: 40 },
  });
  return (
    <View style={styles.root}>
      <LinearGradient
        start={[0.25, 0.25]}
        end={[0.75, 0.75]}
        colors={[colors[0], colors[1] ?? colors[0]]}
        style={styles.gradient}
      />
    </View>
  );
}

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
  const press = () => {
    modalizeRef?.current?.open();
  };

  return (
    <>
      <List.Item
        title={colors[0] + (colors[1] ? ` + ${colors[1]}` : "")}
        onPress={press}
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

export default function Favourite(): JSX.Element {
  const theme = useTheme();
  const dispatch = useDispatch();
  const favouriteColors: string[] = useSelector(
    (state: Store) => state.favouriteColors,
    favouritesEquality
  );

  const favouriteGradients: Gradient[] = useSelector(
    (state: Store) => state.favouriteGradients,
    favouriteGradientsEquality
  );
  const styles = StyleSheet.create({
    scrollview: { marginTop: 15 },
    container: { alignSelf: "center", alignItems: "center", marginTop: 10 },
    text: { fontSize: 18, color: theme.colors.text, textAlign: "left" },
  });
  return (
    <ScrollView style={styles.scrollview}>
      <View>
        {favouriteColors.length === 0 ? (
          favouriteGradients.length === 0 ? (
            <View style={styles.container}>
              <Lottie
                autoPlay
                hardwareAccelerationAndroid
                autoSize
                loop={false}
                // eslint-disable-next-line global-require
                source={require("../../../assets/animations/favourite.json")}
              />
              <Text style={styles.text}>
                You haven`t saved any favourites yet
              </Text>
            </View>
          ) : (
            <View style={styles.container}>
              <Text style={{ color: theme.colors.text }}>
                You haven`t saved any colors yet
              </Text>
            </View>
          )
        ) : (
          <View style={{ marginTop: theme.spacing(4) }}>
            <Text style={styles.text}>Colors</Text>
            {favouriteColors.map((fav: string) => (
              <Color
                key={fav}
                delete={() => dispatch(removeFavouriteColor(fav))}
                colors={[fav]}
              />
            ))}
          </View>
        )}
        {favouriteColors.length === 0 && favouriteGradients.length === 0 ? (
          <Text></Text>
        ) : (
          <Divider
            style={{
              marginTop: theme.spacing(2),
              marginBottom: theme.spacing(2),
            }}
          />
        )}
        {favouriteGradients.length > 0 ? (
          <View style={{ marginTop: theme.spacing(4) }}>
            <Text style={styles.text}>Gradients</Text>
            {favouriteGradients.map((g: Gradient) => {
              const array = [g.start, g.end];
              return (
                <Color
                  key={g.start + g.end}
                  delete={() => dispatch(removeFavouriteGradient(g))}
                  colors={array}
                />
              );
            })}
          </View>
        ) : favouriteColors.length !== 0 ? (
          <View style={styles.container}>
            <Text style={{ color: theme.colors.text }}>
              You haven`t saved any gradients yet
            </Text>
          </View>
        ) : (
          <Text> </Text>
        )}
      </View>
    </ScrollView>
  );
}
