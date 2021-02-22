import { Light } from "@devlights/types";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios, { AxiosResponse } from "axios";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Divider, List, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import useLight from "../../../hooks/useLight";
import useSnackbar from "../../../hooks/useSnackbar";
import { TagsStackParamList } from "../../../interfaces/types";
import { Store } from "../../../store";
import { setLight } from "../../../store/actions/lights";
import { removeTag } from "../../../store/actions/tags";
import { tagsEquality } from "../../../utils";

export type TagScreenNavigationProp = StackNavigationProp<
  TagsStackParamList,
  "tag"
>;
export type TagScreenRouteProp = RouteProp<TagsStackParamList, "tag">;

export default function TagScreen(): JSX.Element {
  const { params } = useRoute<TagScreenRouteProp>();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const snackbar = useSnackbar();
  const light = useLight();
  const theme = useTheme();

  React.useEffect(() => {
    navigation.setOptions({ headerTitle: params.tag });
  }, [params.tag]);
  const lights: Light[] = useSelector(
    (state: Store) => state.lights.filter((l) => l.tags?.includes(params.tag)),
    (l: Light[], r: Light[]) => tagsEquality(l, r, lights.length, params.tag),
  );

  const onPress = (type: string) => {
    axios
      .patch(`http://devlight/tags/${params.tag}/${type}`)
      .then((res: AxiosResponse) => {
        snackbar.makeSnackbar(res.data.message, theme.colors.success);
        const newLights: Light[] = res.data.object as Light[];
        newLights.map((l: Light) => dispatch(setLight(l.id, l)));
      })
      .catch((err) => {
        snackbar.makeSnackbar(
          err.response.data.message ?? `Maybe all Lights are already ${type}?`,
          theme.colors.error,
        );
      });
  };

  const styles = StyleSheet.create({
    contentContainerStyle: { alignItems: "center" },
    button_container: {
      flexDirection: "row",
      alignSelf: "center",
      margin: theme.spacing(4),
    },
    title: { fontSize: 18, textAlignVertical: "top" },
    button_left: { borderBottomRightRadius: 0, borderTopRightRadius: 0 },
    button_middle_text: {
      textAlignVertical: "center",
      backgroundColor: theme.colors.primary,
      color: theme.colors.lightText,
    },
    button_right: { borderBottomLeftRadius: 0, borderTopLeftRadius: 0 },
    item_container: {
      borderRadius: 12,
      backgroundColor: theme.colors.grey,
      width: "90%",
    },
    item_headline: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
      fontWeight: "bold",
    },
    item_divider: { margin: theme.spacing(2) },
    list_item: { margin: theme.spacing(2) },
    list_icon: { alignSelf: "center" },
  });
  return (
    <ScrollView contentContainerStyle={styles.contentContainerStyle}>
      <View style={styles.button_container}>
        <Button
          style={styles.button_left}
          mode="contained"
          onPress={() => onPress("on")}
        >
          All on
        </Button>
        <Text style={styles.button_middle_text}> | </Text>
        <Button
          style={styles.button_right}
          mode="contained"
          onPress={() => onPress("off")}
        >
          All off
        </Button>
      </View>

      <View style={styles.item_container}>
        <Text style={styles.item_headline}>
          Lights with tag
          {` ${params.tag}`}
        </Text>
        <Divider style={styles.item_divider} />
        {lights.map((l: Light) => (
          <List.Item
            key={l.id}
            onPress={() => navigation.navigate("light", { id: l.id })}
            style={styles.list_item}
            titleStyle={styles.title}
            title={l.name}
            right={() => (
              <TouchableOpacity
                style={styles.list_icon}
                onPress={() => (
                  light.removeTags(l.id, [params.tag]).then(() => {
                    if (lights.length <= 1) {
                      navigation.goBack();
                      dispatch(removeTag(params.tag));
                    }
                  })
                )}
              >
                <FontAwesomeIcon
                  color={theme.colors.accent}
                  icon={faTrashAlt}
                  size={24}
                />
              </TouchableOpacity>
            )}
          />
        ))}
      </View>
    </ScrollView>
  );
}
