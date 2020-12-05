import { useTheme } from "@react-navigation/native";
import * as React from "react";
import { ScrollView } from "react-native";
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
      onPress={props.onPress}
      right={() => (
        <Avatar.Icon
          icon="trash-can"
          color="#fff"
          style={{ backgroundColor: theme.colors.background }}
          size={40}
        />
      )}
    />
  );
}

export default function Favourite(): JSX.Element {
  const store = useStore();
  const {favourites} = store.getState();

  return (
    <>
      <FAB
        onPress={() => console.log("press")}
        style={{ position: "absolute", bottom: 32, right: 32, zIndex: 30 }}
        icon="plus"
      />
      <ScrollView>
        {favourites.length > 0 ? (
          favourites.map((fav: string) => {
            const onPress = () => {
              store.dispatch({ type: REMOVE_FAVOURITE, favourite: fav });
            };
            return <Color onPress={onPress} color={fav} />;
          })
        ) : (
          <Text> You haven`t saved any favourite colors</Text>
        )}
      </ScrollView>
    </>
  );
}
