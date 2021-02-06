/* eslint-disable no-return-await */
import Axios, { AxiosError, AxiosResponse } from "axios";
import * as React from "react";
import { useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";
import { Pattern } from "../../interfaces/types";
import { editLightName, setLedCount, setLight, setLightBrightness, setLightColor, setLightStatus } from "../../store/actions/lights";
import useSnackbar from "../useSnackbar";

export const LightContext = React.createContext<{
  fetchLight(id: string): Promise<AxiosResponse<unknown>>;
  setStatus(id: string, status: boolean): Promise<AxiosResponse<unknown>>
  setName(id: string, name: string): Promise<AxiosResponse<unknown>>;
  setCount(id: string, count: number): Promise<AxiosResponse<unknown>>;
  setColor(
    id: string,
    colors: string[],
    pattern?: Pattern
  ): Promise<AxiosResponse<unknown>>;
  setBrightness(
    id: string,
    brightness: number
  ): Promise<AxiosResponse<unknown>>;
}>({
      fetchLight: () => new Promise<AxiosResponse>((): void => {}),
      setStatus: () => new Promise<AxiosResponse>((): void => {}),
      setName: () => new Promise<AxiosResponse>((): void => {}),
      setCount: () => new Promise<AxiosResponse>((): void => {}),
      setColor: () => new Promise<AxiosResponse>((): void => {}),
      setBrightness: () => new Promise<AxiosResponse>((): void => {}),
    });

export interface LightProviderProps {
  children?: JSX.Element;
}

export default function LightProvider(props: LightProviderProps): JSX.Element {
  const dispatch = useDispatch();
  const snackbar = useSnackbar();
  const theme = useTheme();

  async function fetchLight(id: string) {
    const ax = Axios.get(`http://devlight/lights/${id}`);
    ax.then((res: AxiosResponse) => {
      dispatch(setLight(id, res.data.object));
    });
    return await ax;
  }

  async function setStatus(id: string, status: boolean) : Promise<AxiosResponse> {
    const ax = Axios.patch(`http://devlight/lights/${id}/${status ? "on" : "off"}`);
    ax.then((res: AxiosResponse) => {
      snackbar.makeSnackbar(res.data.message, theme.colors.success);
      dispatch(setLightStatus(id, status));
    });
    ax.catch((err: AxiosError) => {
      snackbar.makeSnackbar(err.response?.data.message, theme.colors.error);
    });
    return await ax;
  }

  async function setName(id: string, name: string): Promise<AxiosResponse> {
    const ax = Axios.patch(`http://devlight/lights/${id}/update`, {
      name,
    });
    ax.then((res: AxiosResponse) => {
      snackbar.makeSnackbar(res.data.message, theme.colors.success);
      dispatch(editLightName(id, name));
    });

    ax.catch((err: AxiosError) => {
      snackbar.makeSnackbar(err?.response?.data.message ?? "Unexpected Error", theme.colors.error);
    });
    return await ax;
  }

  async function setCount(id: string, count: number): Promise<AxiosResponse> {
    const ax = Axios.patch(`http://devlight/lights/${id}/count`, {
      count,
    });
    ax.then((res: AxiosResponse) => {
      snackbar.makeSnackbar(res.data.message, theme.colors.success);
      dispatch(setLedCount(id, count));
    });
    ax.catch((err: AxiosError) => {
      snackbar.makeSnackbar(err?.response?.data.message ?? "Unexpected Error", theme.colors.error);
    });
    return await ax;
  }

  async function setColor(
    id: string,
    colors: string[],
    pattern?: Pattern,
  ): Promise<AxiosResponse<unknown>> {
    const ax = Axios.patch(
      `http://devlight/lights/${id}/color`,
      {
        colors,
        pattern,
      },
      {
        timeout: 3000,
      },
    );
    ax.then((res: AxiosResponse) => {
      if (res.status === 304) {
        snackbar.makeSnackbar("Nothing changed", theme.colors.error);
      } else if (res.status === 200) {
        snackbar.makeSnackbar(res.data.message, theme.colors.success);
        dispatch(setLightColor(id, pattern ?? "plain", colors));
      }
    });
    ax.catch((err: AxiosError) => {
      snackbar.makeSnackbar(
        err?.response?.data.message ?? "Unexpected error",
        theme.colors.error,
      );
    });
    return await ax;
  }

  async function setBrightness(
    id: string,
    brightness: number,
  ): Promise<AxiosResponse> {
    const ax = Axios.patch(`http://devlight/lights/${id}/brightness`, {
      brightness: Math.round(brightness),
    });
    ax.then(() => {
      dispatch(setLightBrightness(id, brightness));
    });
    return await ax;
  }

  const { children } = props;
  return (
    <LightContext.Provider
      value={{
        fetchLight,
        setStatus,
        setName,
        setCount,
        setColor,
        setBrightness,
      }}
    >
      {children}
    </LightContext.Provider>
  );
}
