import React from "react";
import { Light } from "@devlights/types";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { Divider, List, Text, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import useLight from "../../hooks/useLight";
import { Store } from "../../store";
import ChangeableText from "../ChangeableText";
import { ChangeableTextProps } from "../ChangeableText/ChangeableText";
import { TagScreenNavigationProp } from "../Tags/TagScreen/TagScreen";
import { StyleSheet } from "react-native";

export interface TagsListProps {
  light: Light;
  setEnabled: (enabled: boolean) => void;
  enabled: boolean,
}

export default function TagsList(props: TagsListProps): JSX.Element {
  const { enabled, light } = props;
  const theme = useTheme();
  const tags = useSelector((state: Store) => state.tags);
  const lights = useLight();

  const addTag = async (tag: string) => {
    const index = tags.findIndex(
      (t: string) => t.toLowerCase() === tag.toLowerCase(),
    );
    await lights.addTags(light.id, [index >= 0 ? tags[index] : tag]);
    props.setEnabled(false);
  };

  const newNav = useNavigation<TagScreenNavigationProp>();
  const navigateToTag = (tag: string) => {
    newNav.navigate("tag", { tag });
  };

  const styles = StyleSheet.create({
    item_headline: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
      fontWeight: "bold",
    },
    item_divider: { margin: theme.spacing(2) },
    list_item: { padding: theme.spacing(2) },
    title: {
      flex: 3,
      textAlignVertical: "center",
      fontSize: 20,
    },
    changeableItem: {
      width: "100%",
      fontSize: 14,
      fontWeight: "normal",
      color: theme.colors.text,
    },
  });
  return (
    <>
      <Text style={styles.item_headline}>Tags</Text>
      <Divider style={styles.item_divider} />
      {light.tags?.length > 0
        ? light.tags?.map((tag: string) => (
          <>
            <List.Item
              key={tag}
              onPress={() => navigateToTag(tag)}
              style={styles.list_item}
              titleStyle={styles.title}
              title={tag}
            />
            <Divider />
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
    </>
  );
}
