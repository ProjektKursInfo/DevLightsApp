import * as React from "react";
import { Component } from "react";
import { ScrollView, View, StyleSheet, Pressable } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useStore } from "react-redux";

export interface FavouriteListProps {
  onPress: () => void;
}

export default function FavouriteList(props: FavouriteListProps): JSX.Element {
  const store = useStore();
  const {favourites} = store.getState();
  const styles = StyleSheet.create({
    container: {width: "100%", height: "20%", alignItems: "center"},
    text: {textAlignVertical: "top", fontSize: 18, marginBottom: 10},
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favourite Colors</Text>
      <ScrollView horizontal>
        {favourites.length > 0 ? (
          favourites.map((fav: string) => (
            <Pressable key={fav} onPress={() => props.onPress(fav)}>
              <Avatar.Text size={40} style={{ backgroundColor: fav, marginLeft: 10 }} label="" />
            </Pressable>
          ))
        ) : (
          <> </>
        )}
      </ScrollView>
    </View>
  );
}
