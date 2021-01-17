/* eslint-disable no-return-await */
import Axios, { AxiosError, AxiosPromise, AxiosResponse } from "axios";
import * as React from "react";
import { useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";
import {
  EDIT_LED_COUNT,
  EDIT_LIGHT_COLOR,
  EDIT_LIGHT_NAME,
} from "../../store/actions/types";
import useSnackbar from "../useSnackbar";

export const LightContext = React.createContext<{
  setName(id: string, name: string): Promise<any>;
  setCount(id: string, count: number): Promise<any>;
  setColor(id: string, colors: string[], pattern?: string): Promise<any>;
}>(undefined);

export interface LightProviderProps {
  children?: JSX.Element;
}

export default function LightProvider(props: LightProviderProps): JSX.Element {
  const dispatch = useDispatch();
  const snackbar = useSnackbar();
  const theme = useTheme();

  async function setName(id: string, name: string) {
    const ax = Axios.patch(`http://devlight/${id}`, {
      name,
    });
    ax.then((res: AxiosResponse) => {
      snackbar.makeSnackbar(res.data.message, theme.colors.accent);
      dispatch({ type: EDIT_LIGHT_NAME, id, name });
    });
    return await ax;
  }

  async function setCount(id: string, count: number) {
    const ax = Axios.patch(`http://devlight/${id}/count`, {
      count,
    });
    ax.then((res: AxiosResponse) => {
      snackbar.makeSnackbar(res.data.message, theme.colors.accent);
      dispatch({ type: EDIT_LED_COUNT, id, count });
    });
    return await ax;
  }

  async function setColor(
    id: string,
    colors: string[],
    pattern?: string,
  ): Promise<AxiosPromise> {
    const ax = Axios.patch(
      `http://devlight/${id}/color`,
      {
        colors,
        pattern,
      },
      {
        timeout: 200,
        validateStatus(status) {
          return status < 400; // Reject only if the status code is greater than or equal to 400
        },
      },
    );
    ax.then((res: AxiosResponse) => {
      if (res.status === 304) {
        snackbar.makeSnackbar("Nothing changed", "#f00");
      } else if (res.status === 200) {
        snackbar.makeSnackbar(res.data.message, theme.colors.accent);
        dispatch({
          type: EDIT_LIGHT_COLOR,
          id,
          colors,
        });
      }
    });
    ax.catch((err: AxiosError) => {
      snackbar.makeSnackbar(
        err?.response?.data.message ?? "Unexpected error",
        "#f00",
      );
    });
    return await ax;
  }

  return (
    <LightContext.Provider
      value={{
        setName,
        setCount,
        setColor,
      }}
    >
      {props.children}
    </LightContext.Provider>
  );
}
