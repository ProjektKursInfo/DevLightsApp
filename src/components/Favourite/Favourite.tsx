import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import * as React from "react";
import { Pressable, ScrollView } from "react-native";
import { Avatar, FAB, List, Text } from "react-native-paper";
import { useStore } from "react-redux";
import { REMOVE_FAVOURITE } from "../../store/actions/types";

export function Color(props: {
  color: string;
  onPress: () => void;
}): JSX.Element {
  const theme = useTheme();
  return (
    <List.Item
      title={props.color}
      left={() => (
        <Avatar.Text
          label=""
          size={40}
          style={{ backgroundColor: props.color }}
        />
      )}
      right={() => (
        <Pressable style={{ alignSelf: "center" }} onPress={props.onPress}>
          <FontAwesomeIcon icon={faTrash} color="#fff" />
        </Pressable>
      )}
    />
  );
}

export default function Favourite(): JSX.Element {
  const store = useStore();
  const { favourites } = store.getState();
  const onPress = (fav: string) => {
    store.dispatch({ type: REMOVE_FAVOURITE, favourite: fav });
  };
  return (
    <ScrollView>
      {favourites.length > 0 ? (
        favourites.map((fav: string) => (
          <Color onPress={() => onPress(fav)} color={fav} />
        ))
      ) : (
        <Text> You haven`t saved any favourite colors</Text>
      )}
    </ScrollView>
  );
}
