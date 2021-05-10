import { Light } from "@devlights/types";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import { map } from "lodash";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Divider, List, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { LightResponse, TagsStackParamList } from "../../interfaces/types";
import { Store } from "../../store";
import { setLight } from "../../store/actions/lights";
import { removeTag } from "../../store/actions/tags";
import { tagsEquality } from "../../utils";
import BrightnessSlider from "../BrightnessSlider";
import Powerbulb from "../Powerbulb";

export type TagScreenNavigationProp = StackNavigationProp<
  TagsStackParamList,
  "tag"
>;
export type TagScreenRouteProp = RouteProp<TagsStackParamList, "tag">;

export default function TagScreen(): JSX.Element {
  const { params } = useRoute<TagScreenRouteProp>();
  const { tag } = params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useTheme();
  const lights: Light[] = useSelector(
    (state: Store) => state.lights.filter((l) => l.tags?.includes(tag)),
    (l: Light[], r: Light[]) => tagsEquality(l, r, lights.length, tag),
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: params.tag,
      headerRight: () => <Powerbulb ids={map(lights, "id")} />,
    });
  }, [params.tag]);

  const onSubmit = async (color: string): Promise<boolean> => {
    let success = true;
    lights.forEach(async (l: Light) => {
      const ax = axios.patch(`/lights/${l.id}/color`, {
        colors: [color],
        pattern: "plain",
      });

      await ax.then((res: LightResponse) => {
        dispatch(setLight(l.id, res.data.object));
        success = true;
      });
      await ax.catch(() => {
        success = false;
      });
    });

    return success;
  };

  const removeTags = (id: string, tags: string[]) => {
    const ax = axios.delete(`/lights/${id}/tags`, {
      data: { tags },
    });
    ax.then((res: LightResponse) => {
      dispatch(setLight(id, res.data.object));
      if (lights.length <= 1) {
        navigation.goBack();
        dispatch(removeTag(params.tag));
      }
    });
  };

  const styles = StyleSheet.create({
    contentContainerStyle: { alignItems: "center" },
    icon_container: {
      flexDirection: "row",
      alignSelf: "center",
      alignItems: "center",
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
    slider_container: {
      width: "90%",
      margin: theme.spacing(6),
    },
    slider_text: {
      fontSize: 20,
      fontFamily: "TitilliumWeb-Regular",
    },
    button: {
      margin: theme.spacing(2),
    },
  });
  return (
    <ScrollView contentContainerStyle={styles.contentContainerStyle}>
      <View style={styles.slider_container}>
        <Text style={styles.slider_text}> Brightness</Text>
        <BrightnessSlider color="#1de9b6" ids={map(lights, "id")} />
      </View>

      <View style={styles.item_container}>
        <Text style={styles.item_headline}>
          Lights with tag
          {` ${tag}`}
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
                onPress={() => removeTags(l.id, [params.tag])}
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

      <Button
        mode="contained"
        style={styles.button}
        onPress={() =>
          navigation.navigate("color_modal", { color: "#000000", onSubmit })
        }
      >
        Color
      </Button>
    </ScrollView>
  );
}
