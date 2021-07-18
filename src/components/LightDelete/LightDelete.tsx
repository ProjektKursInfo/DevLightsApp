import axios from "axios";
import React from "react";
import {
  Button,
  Dialog,
  Paragraph,
  Portal,
  useTheme,
} from "react-native-paper";
import { useDispatch } from "react-redux";
import useSnackbar from "../../hooks/useSnackbar";
import { removeLight } from "../../store/actions/lights";

export interface LightDeleteProps {
  visible: boolean;
  id: string;
  onDismiss: () => void;
  onConfirm: () => void;
}
export default function LightDelete(props: LightDeleteProps): JSX.Element {
  const { visible, id, onDismiss } = props;
  const dispatch = useDispatch();
  const theme = useTheme();
  const snackbar = useSnackbar();

  const onConfirm = () => {
    axios
      .delete(`/lights/${id}`)
      .then(() => {
        dispatch(removeLight(id));
        props.onConfirm();
      })
      .catch(() => {
        props.onDismiss();
        snackbar.makeSnackbar(
          "An error orcurred while trying to delete this light",
          theme.colors.error,
        );
      });
  };

  return (
    <Portal>
      <Dialog visible={visible} dismissable onDismiss={onDismiss}>
        <Dialog.Title>Delete Light</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Are you sure you want to delete this light?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} color={theme.colors.accent}>
            Cancel
          </Button>
          <Button
            onPress={onConfirm}
            mode="contained"
            color={theme.colors.error}
          >
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
