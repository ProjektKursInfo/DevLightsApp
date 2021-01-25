import * as React from "react";
import { Modalize } from "react-native-modalize";
import {
  Button,
  Portal,
  Title,
  useTheme,
  RadioButton
} from "react-native-paper";
import { useSelector } from "react-redux";
import useLight from "../../../hooks/useLight";
import { Light } from "../../../interfaces";
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
              key={l.id}
              disabled={!l.isOn}
              value={l.id}
              label={l.name}
              labelStyle={{
                color: l.isOn ? theme.colors.lightText : theme.colors.grey,
              }}
              mode="ios"
              onPress={() => onPress(l.id)}
              status={values.includes(l.id) ? "checked" : "unchecked"}
            />
          ))}

          <Button disabled={values.length === 0} onPress={() => onConfirm()}>
            Apply color
          </Button>
        </Modalize>
      </Portal>
    );
  },
);

export default ApplyDialog;
