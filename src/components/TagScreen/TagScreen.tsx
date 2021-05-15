import { Light, Pattern, Response } from "@devlights/types";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios, { AxiosError, AxiosResponse } from "axios";
import { map } from "lodash";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider, List, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import useSnackbar from "../../hooks/useSnackbar";
import { LightResponse, TagsStackParamList } from "../../interfaces/types";
import { Store } from "../../store";
import { setLight } from "../../store/actions/lights";
import { removeTag } from "../../store/actions/tags";
import { tagsEquality } from "../../utils";
import BrightnessSlider from "../BrightnessSlider";
import PatternComponent from "../PatternComponent";
import PatternPicker from "../PatternPicker";
import Powerbulb from "../Powerbulb";

export type TagScreenNavigationProp = StackNavigationProp<
  TagsStackParamList,
  "tag"
>;
export type TagScreenRouteProp = RouteProp<TagsStackParamList, "tag">;

export default function TagScreen(): JSX.Element {
  const { params } = useRoute<TagScreenRouteProp>();
  const { tag } = params;
  const snackbar = useSnackbar();
  const [pickerOpen, setOpen] = React.useState(false);
  const [leds, setLeds] = React.useState<{
    colors: string[];
    pattern: Pattern | string;
    timeout: number | undefined;
  }>({
    colors: ["#000000"],
    pattern: "unkown",
    timeout: undefined,
  });
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
      headerRight: () => (
        <Powerbulb type="tag" tag={tag} ids={map(lights, "id")} />
      ),
    });
  }, [params.tag]);

  const changeColor = async (
    pColors: string[],
    timeout: number | undefined,
  ) => {
    setLeds({ ...leds, colors: pColors, timeout });
    const ax = axios.patch(`/tags/${tag}/color`, {
      colors: ["fading", "rainbow"].includes(leds.pattern) ? [] : pColors,
      pattern: leds.pattern,
      timeout: ["plain", "gradient"].includes(leds.pattern)
        ? undefined
        : timeout ?? 100,
    });
    ax.then((res: AxiosResponse<Response<Light[]>>) => {
      res.data.object.forEach((l: Light) => dispatch(setLight(l.id, l)));
      snackbar.makeSnackbar(res.data.message, theme.colors.success);
    }).catch((err: AxiosError) => {
      snackbar.makeSnackbar(
        err.response?.status === 304
          ? "Nothing chanded"
          : err.response?.data.message,
        theme.colors.error,
      );
      setLeds({ colors: ["#000000"], pattern: "unkown", timeout: undefined });
    });
    return await ax;
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
    container: {
      height: Dimensions.get("window").height,
      width: "100%",
      marginTop: 0,
    },
    title: { fontSize: 18, textAlignVertical: "top" },
    item_container: {
      borderRadius: 12,
      backgroundColor: theme.colors.grey,
      width: "90%",
      alignSelf: "center",
      zIndex: -1,
    },
    item_headline: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
      fontWeight: "bold",
    },
    item_divider: { margin: theme.spacing(2), marginBottom: 0 },
    list_item: { margin: 0 },
    list_icon: { alignSelf: "center" },
    slider_container: {
      width: "90%",
      margin: theme.spacing(6),
      zIndex: -1,
    },
    slider_text: {
      fontSize: 20,
      fontFamily: "TitilliumWeb-Regular",
    },
    button: {
      margin: theme.spacing(2),
    },
    selectContainer: {
      width: "90%",
      alignSelf: "center",
      marginTop: theme.spacing(2),
      zIndex: 1,
    },
    selectLabel: {
      marginLeft: 5,
    },
    divider: {
      zIndex: -1,
      flex: 1,
      backgroundColor: `${theme.colors.text}aa`,
      marginVertical: 15,
    },
    pattern: {
      marginLeft: theme.spacing(7),
      marginRight: theme.spacing(5),
    },
    note: { textAlign: "center", flex: 2, marginTop: 10 },
  });
  return (
    <View style={{ height: Dimensions.get("window").height }}>
      <ScrollView style={styles.container}>
        <View style={[styles.selectContainer, { flex: 1 }]}>
          <View style={styles.pattern}>
            <Text style={[styles.selectLabel]}>Choose pattern for tag</Text>
            <PatternPicker
              changePattern={(p: Pattern | string) =>
                setLeds({ ...leds, pattern: p })
              }
              pattern={leds.pattern}
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
              pickerOpen={pickerOpen}
            />
          </View>
          <View />
          {leds.pattern === "unkown" ? undefined : (
            <View style={{ zIndex: -1 }}>
              <Divider style={styles.divider} />
              <PatternComponent
                pattern={leds.pattern as Pattern}
                timeout={100}
                colors={leds.colors}
                disabled={false}
                onSubmit={changeColor}
              />
            </View>
          )}
          <Text style={styles.note}>
            Note that its not saved on this screen which color you apply to tags
          </Text>
        </View>

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
          <Divider style={styles.item_divider} />
        </View>
      </ScrollView>
    </View>
  );
}
