import * as React from "react";
import { SnackbarContext } from "./SnackbarProvider";

export default function useSnackbar() {
  return React.useContext<{
    makeSnackbar(message: string, color: string): void
  }>(SnackbarContext);
}
