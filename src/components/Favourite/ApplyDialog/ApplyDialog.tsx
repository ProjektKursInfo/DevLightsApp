import * as React from "react";
import { StyleSheet } from "react-native";
import { Modalize } from "react-native-modalize";
import {
  Button,
  Portal,
  Title,
  useTheme,
  RadioButton,
  List,
} from "react-native-paper";
import { useSelector } from "react-redux";
import { Light } from "@devlights/types";
import useLight from "../../../hooks/useLight";
import { Store } from "../../../store";

interface ApplyDialogProps {
  colors: string[];
  onConfirm: () => void;
}

export const ApplyDialog = React.forwardRef(
  (
    props: ApplyDialogProps,
    ref: React.ForwardedRef<Modalize>,
  ) => {
    const lights = useSelector((state: Store) => state.lights);
    const theme = useTheme();
    const light = useLight();

    const [values, setValues] = React.useState<string[]>([]);

    const snapPoint = 150 + lights.length * 30;

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
      if (values.length > 0) {
        values.forEach((v: string) => {
          light.setColor(v, props.colors, props.colors.length > 1 ? "gradient" : "plain");
        });
      }
    };

    const styles = StyleSheet.create({
      modal: {
        backgroundColor: theme.colors.background,
      },
      title: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
      },
      item_text: {
        textAlign: "center",
      },
    });
    return (
      <Portal>
        <Modalize
          snapPoint={snapPoint}
          useNativeDriver
          modalStyle={styles.modal}
          ref={ref}
          onClose={() => setValues([])}
        >
          <Title
            style={styles.title}
          >
            Apply favourite color on Light
          </Title>
          {lights.length > 0 ? lights.map((l: Light) => (
            <RadioButton.Item
              key={l.id}
              disabled={!l.isOn}
              value={l.id}
              label={l.name}
              labelStyle={{
                color: l.isOn ? theme.colors.text : theme.colors.grey,
              }}
              mode="ios"
              onPress={() => onPress(l.id)}
              status={values.includes(l.id) ? "checked" : "unchecked"}
            />
          )) : <List.Item titleStyle={styles.item_text} title="There arent any lights."> </List.Item>}
          <Button disabled={values.length === 0 || lights.length === 0} onPress={() => onConfirm()}>
            Apply color
          </Button>
        </Modalize>
      </Portal>
    );
  },
);

export default ApplyDialog;
