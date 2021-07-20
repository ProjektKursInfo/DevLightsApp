import { Light } from "@devlights/types";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import axios, { AxiosError } from "axios";
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Divider, List, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import useSnackbar from "../../hooks/useSnackbar";
import { LightResponse } from "../../interfaces/types";
import { Store } from "../../store";
import { setLight } from "../../store/actions/lights";
import { addTag as addTagsToStore } from "../../store/actions/tags";
import ChangeableText from "../ChangeableText";
import { TagScreenNavigationProp } from "../TagScreen/TagScreen";

export interface TagsListProps {
  light: Light;
  setEnabled: (enabled: boolean) => void;
  enabled: boolean;
}

export default function TagsList(props: TagsListProps): JSX.Element {
  const { enabled, light } = props;
  const theme = useTheme();
  const snackbar = useSnackbar();
  const tags = useSelector((state: Store) => state.tags);
  const dispatch = useDispatch();

  const addTag = async (tag: string) => {
    const index = tags.findIndex(
      (t: string) => t.toLowerCase() === tag.toLowerCase(),
    );
    const ax = axios.put(`/lights/${light.id}/tags`, {
      tags: [index >= 0 ? tags[index] : tag],
    });
    ax.then((res: LightResponse) => {
      dispatch(addTagsToStore(tag));

      snackbar.makeSnackbar(
        res.data.message,
        res.status === 200 ? theme.colors.success : theme.colors.error,
      );
      props.setEnabled(false);
    });
    ax.catch((err: AxiosError) => {
      snackbar.makeSnackbar(
        err.response?.data.message ?? "Nothing changed!",
        theme.colors.error,
      );
      props.setEnabled(false);
    });
  };

  const newNav = useNavigation<TagScreenNavigationProp>();
  const navigateToTag = (tag: string) => {
    newNav.navigate("tag", { tag });
  };

  const removeTag = (id: string, tag: string) => {
    axios.delete(`/lights/${id}/tags`, {
      data: { tags: [tag] },
    });
  };

  const styles = StyleSheet.create({
    title: { fontSize: 18, textAlignVertical: "top" },
    item_container: {
      borderRadius: 12,
      backgroundColor: theme.colors.grey,
      width: "90%",
      alignSelf: "center",
      zIndex: -1,
    },
    item_headline: {
      margin: theme.spacing(2),
      fontWeight: "bold",
    },
    item_divider: { margin: 0 },
    list_item: { margin: 0 },
    list_icon: { alignSelf: "center" },
    changeableItem: {
      width: "100%",
      fontSize: 14,
      fontWeight: "normal",
      color: theme.colors.text,
    },
  });
  return (
    <View style={styles.item_container}>
      <Text style={styles.item_headline}>Tags</Text>

      <Divider style={styles.item_divider} />
      {light.tags?.length
        ? light.tags?.map((tag: string) => (
            <>
              <List.Item
                key={tag}
                onPress={() => navigateToTag(tag)}
                style={styles.list_item}
                titleStyle={styles.title}
                title={tag}
                right={() => (
                  <TouchableOpacity
                    style={styles.list_icon}
                    onPress={() => removeTag(light.id, tag)}
                  >
                    <FontAwesomeIcon
                      color={theme.colors.accent}
                      icon={faTrashAlt}
                      size={24}
                    />
                  </TouchableOpacity>
                )}
              />
              <Divider style={styles.item_divider} />
            </>
          ))
        : undefined}

      <ChangeableText
        onFocus={() => props.setEnabled(true)}
        error={!enabled}
        value=""
        textAlign="left"
        placeholderTextColor={theme.colors.lightText}
        inputStyle={styles.changeableItem}
        editIcon={faPlus}
        onSave={addTag}
        placeholder="Add Tag"
      />
    </View>
  );
}
