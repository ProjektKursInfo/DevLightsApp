import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios, { AxiosResponse } from "axios";
import Lottie from "lottie-react-native";
import React from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Text, Title } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { TagsStackParamList } from "../../interfaces/types";
import { Store } from "../../store";
import { setTags } from "../../store/actions/tags";
import { tagArrayEquality } from "../../utils";
import TagCard from "../TagCard";

export type HomeScreenNavigationProp = StackNavigationProp<
TagsStackParamList,
"home"
>;
export type HomeScreenRouteProp = RouteProp<TagsStackParamList, "home">;

function Tags(): JSX.Element {
  const dispatch = useDispatch();
  const tags = useSelector(
    (state: Store) => state.tags,
    (l: string[], r: string[]) => tagArrayEquality(l, r),
  );
  const [refresh, setRefresh] = React.useState<boolean>(false);

  const fetch = (refreshing = false) => {
    if (refreshing) setRefresh(true);
    axios.get("http://devlight/tags").then((res: AxiosResponse) => {
      dispatch(setTags(res.data.object));
      if (refreshing) setRefresh(false);
    });
  };

  const styles = StyleSheet.create({
    container: { width: "100%", height: "100%" },
    contentContainerStyle: { alignItems: "center" },
    title: {
      paddingTop: 30,
      marginBottom: 10,
      fontSize: 40,
    },
    error_text: {
      textAlign: "center",
      fontSize: 16,
    },
  });
  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={() => fetch(true)} />
        }
        contentContainerStyle={styles.contentContainerStyle}
      >
        <Title style={styles.title}>Tags</Title>
        {tags.length === 0 ? (
          <>
            <Lottie
              duration={4000}
              autoPlay
              hardwareAccelerationAndroid
              loop={false}
              autoSize
              // eslint-disable-next-line global-require
              source={require("../../../assets/animations/bulb.json")}
            />
            <Text style={styles.error_text}>
              Sorry! There aren`t any tags yet.
            </Text>
          </>
        ) : (
          tags.map((tag: string) => <TagCard key={tag} tag={tag} />)
        )}
      </ScrollView>
    </View>
  );
}
export default Tags;
