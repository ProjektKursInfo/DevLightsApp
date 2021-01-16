import React from "react";
import Snackbar from "./SnackBar";

const SnackbarContext = React.createContext({});

export interface ProviderProps {
  children?: JSX.Element;
}

export default function SnackbarProvider(props: ProviderProps) : JSX.Element {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");
  const [color, setColor] = React.useState<string>("#000");

  const makeSnackbar = (message: string, color: string) => {
    setMessage(message);
    setColor(color);
    setVisible(true);
  };

  const handleSnackbarDismiss = () => {
    setMessage("");
    setColor("#000");
    setVisible(false);
  };
  return (
    <SnackbarContext.Provider value={{ makeSnackbar }}>
      {props.children}
      <Snackbar
        onDismiss={handleSnackbarDismiss}
        visible={visible}
        message={message}
        color={color}
      />
    </SnackbarContext.Provider>
  );
}

export { SnackbarContext };
