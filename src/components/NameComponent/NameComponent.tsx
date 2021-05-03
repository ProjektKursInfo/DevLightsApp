import { Light } from "@devlights/types";
import axios from "axios";
import React from "react";
import { useTheme } from "react-native-paper";
import ChangeableText from "../ChangeableText";

export interface NameComponentProps {
  light: Light;
}
export default function NameComponent(props: NameComponentProps): JSX.Element {
  const { light } = props;
  const theme = useTheme();
  const [error, setError] = React.useState<boolean>();

  const changeName = (name: string) => {
    if (name === light.name) return;
    const ax = axios.patch(`/lights/${light.id}`, { name });
    ax.then(() => {
      setError(false);
    });
    ax.catch(() => {
      setError(true);
    });
  };
  return (
    <ChangeableText
      error={error}
      value={light.name}
      onSave={changeName}
      style={{ marginBottom: theme.spacing(5) }}
    />
  );
}
