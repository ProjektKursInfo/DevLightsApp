import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faEllipsisV, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { Menu, useTheme } from "react-native-paper";
import useSnackbar from "../../hooks/useSnackbar";
import Icon from "../Icon";
import LightDelete from "../LightDelete";
import Powerbulb from "../Powerbulb";
import SleepTimer from "../SleepTimer";

export interface LightControlProps {
  ids: string[];
  tag?: string;
  type: "tag" | "light";
  isOn: boolean;
}
export default function LightControl(props: LightControlProps): JSX.Element {
  const { ids, type, tag, isOn } = props;
  const theme = useTheme();
  const [visible, setVisible] = React.useState<boolean>(false);
  const [timerVisible, setTimerVisible] = React.useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = React.useState<boolean>(false);
  const snackbar = useSnackbar();

  const styles = StyleSheet.create({
    root: { alignSelf: "center", flexDirection: "row" },
    menu_icon: { alignSelf: "center" },
  });
  return (
    <View style={styles.root}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <Icon
            onPress={() => setVisible(true)}
            style={{ marginRight: theme.spacing(4) }}
            color={theme.colors.accent}
            icon={faEllipsisV}
          />
        }
        statusBarHeight={StatusBar.currentHeight}
      >
        <Menu.Item
          icon={() => (
            <FontAwesomeIcon
              style={styles.menu_icon}
              icon={faClock}
              size={20}
              color={theme.colors.accent}
            />
          )}
          title="Sleep Timer"
          onPress={() => {
            if (isOn) {
              setTimerVisible(true);
            } else {
              snackbar.makeSnackbar(
                "Cannot set timer if light or lights are already off!",
                theme.colors.error,
              );
            }
            setVisible(false);
          }}
        />
        {type === "light" ? (
          <>
            <Menu.Item
              icon={() => (
                <FontAwesomeIcon
                  style={styles.menu_icon}
                  icon={faTrash}
                  size={20}
                  color={theme.colors.accent}
                />
              )}
              title="Delete"
              onPress={() => {
                setVisible(false);
                setDeleteVisible(true);
              }}
            />
          </>
        ) : undefined}
      </Menu>
      <LightDelete
        id={ids[0]}
        visible={deleteVisible}
        onConfirm={() => setDeleteVisible(false)}
        onDismiss={() => setDeleteVisible(false)}
      />
      <SleepTimer
        onConfirm={() => setTimerVisible(false)}
        visible={timerVisible}
        id={type === "tag" ? tag ?? "tag" : ids[0]}
        {...props}
      />

      <Powerbulb {...props} />
    </View>
  );
}
