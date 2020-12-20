import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Lottie from "lottie-react-native";
import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from "react-native";
import { Avatar, List, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../../store";
import { REMOVE_FAVOURITE } from "../../store/actions/types";
import { favouritesEquality } from "../../utils";

export function Color(props: {
  color: string;
  onPress: () => void;
}): JSX.Element {
  const { color, onPress } = props;
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {width: "100%"},
    pressable: { alignSelf: "center" },
  });
  return (
    <List.Item
      title={color}
      style={styles.container}
      left={() => (
        <Avatar.Text label="" size={40} style={{ backgroundColor: color }} />
      )}
      right={() => (
        <TouchableOpacity style={styles.pressable} onPress={onPress}>
          <FontAwesomeIcon size={26} icon={faTrash} color={theme.colors.accent} />
        </TouchableOpacity>
      )}
    />
  );
}

export default function Favourite(): JSX.Element {
  const theme = useTheme();
  const dispatch = useDispatch();
  const favourites: string[] = useSelector(
    (state: Store) => state.favourites,
    favouritesEquality,
  );
  const styles = StyleSheet.create({
    scrollview: {marginTop: 10},
    container: {alignSelf: "center", alignItems: "center", marginTop: 10},
  });
  return (
    <View>
      {favourites.length > 0 ? (
        <ScrollView style={styles.scrollview}>
          {favourites.map((fav: string) => (
            <Color
              key={fav}
              onPress={() => (
                dispatch({ type: REMOVE_FAVOURITE, favourite: fav })
              )}
              color={fav}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.container}>
          <Text style={{ color: theme.colors.text }}>
            You haven`t saved any favourite colors
          </Text>
          <Lottie
            autoPlay
            hardwareAccelerationAndroid
            autoSize
            loop={false}
            // eslint-disable-next-line global-require
            source={require("../../../assets/animations/favourite.json")}
          />
        </View>
      )}
    </View>
  );
}
