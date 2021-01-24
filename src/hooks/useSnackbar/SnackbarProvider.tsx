import React from "react";
import Snackbar from "./SnackBar";

const SnackbarContext = React.createContext<{
  makeSnackbar(pMessage: string, pColor: string): void;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
}>(undefined);

export interface ProviderProps {
  children?: JSX.Element;
}

export default function SnackbarProvider(props: ProviderProps): JSX.Element {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");
  const [color, setColor] = React.useState<string>("#000");

  const { children } = props;

  const makeSnackbar = (pMessage: string, pColor: string) => {
    setMessage(pMessage);
    setColor(pColor);
    setVisible(true);
  };

  const handleSnackbarDismiss = () => {
    setMessage("");
    setColor("#000");
    setVisible(false);
  };
  return (
    <SnackbarContext.Provider value={{ makeSnackbar }}>
      {children}
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
