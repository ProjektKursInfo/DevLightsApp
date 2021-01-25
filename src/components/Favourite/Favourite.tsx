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
import {
  Avatar,
  List,
  Portal,
  useTheme,
  Button,
  RadioButton,
  Title,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Modalize } from "react-native-modalize";
import { Store } from "../../store";
import { REMOVE_FAVOURITE } from "../../store/actions/types";
import { favouritesEquality } from "../../utils";
import { Light } from "../../interfaces";
import useLight from "../../hooks/useLight";

const Modal = React.forwardRef(
  (props: {color: string, onConfirm: () => void}, ref: React.ForwardedRef<Modalize>) => {
    const lights = useSelector((state: Store) => state.lights);
    const theme = useTheme();
    const light = useLight();

    const [values, setValues] = React.useState<string[]>([]);

    const onPress = (id: string) => {
      if (!values.includes(id)) {
        setValues([...values, id]);
      } else {
        const index: number = values.indexOf(id);
        const old = [...values];
        old.splice(index, 1);
        setValues(old);
      }
    };

    const onConfirm = () => {
      props.onConfirm();
      values.forEach((v: string) => {
        light.setColor(v, [props.color], "plain");
      });
    };
    return (
      <Portal>
        <Modalize
          snapPoint={200}
          useNativeDriver
          modalStyle={{
            backgroundColor: theme.colors.background,
          }}
          ref={ref}
          onClose={() => setValues([])}
        >
          <Title
            style={{
              marginTop: theme.spacing(2),
              marginLeft: theme.spacing(2),
            }}
          >
            Apply favourite color on Light
          </Title>
          {lights.map((l: Light) => (
            <RadioButton.Item
              value={l.id}
              label={l.name}
              labelStyle={{
                color: values.includes(l.id)
                  ? theme.colors.lightText
                  : theme.colors.grey,
              }}
              mode="ios"
              onPress={() => onPress(l.id)}
              status={values.includes(l.id) ? "checked" : "unchecked"}
            />
          ))}

          <Button onPress={() => onConfirm()}> Apply color</Button>
        </Modalize>
      </Portal>
    );
  },
);

export function Color(props: {
  color: string;
  delete: () => void;
}): JSX.Element {
  const { color } = props;
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: { width: "100%" },
    pressable: { alignSelf: "center" },
  });
  const modalizeRef = React.useRef<Modalize>(null);
  const press = () => {
    modalizeRef?.current?.open();
  };
  return (
    <>
      <List.Item
        title={color}
        onPress={press}
        style={styles.container}
        left={() => (
          <Avatar.Text label="" size={40} style={{ backgroundColor: color }} />
        )}
        right={() => (
          <TouchableOpacity style={styles.pressable} onPress={props.delete}>
            <FontAwesomeIcon
              size={26}
              icon={faTrash}
              color={theme.colors.accent}
            />
          </TouchableOpacity>
        )}
      />
      <Modal onConfirm={() => modalizeRef.current?.close()} color={color} ref={modalizeRef} />
    </>
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
    scrollview: { marginTop: 10 },
    container: { alignSelf: "center", alignItems: "center", marginTop: 10 },
  });

  return (
    <View>
      {favourites.length > 0 ? (
        <ScrollView style={styles.scrollview}>
          {favourites.map((fav: string) => (
            <Color
              key={fav}
              delete={() => dispatch({ type: REMOVE_FAVOURITE, favourite: fav })}
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
