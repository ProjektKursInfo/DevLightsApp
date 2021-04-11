/* eslint-disable no-return-await */
import { Light, Pattern, Response } from "@devlights/types";
import Axios, { AxiosError, AxiosResponse } from "axios";
import * as React from "react";
import { useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";
import {
  editLightName,
  setLedCount,
  setLight,
  setLightBrightness,
  setLightColor,
  setLightStatus,
} from "../../store/actions/lights";
import useSnackbar from "../useSnackbar";

export type LightResponse = AxiosResponse<Response<Light>>;

export const LightContext = React.createContext<{
  fetchLight(id: string): Promise<LightResponse>;
  setStatus(id: string, status: boolean): Promise<LightResponse>;
  setName(id: string, name: string): Promise<LightResponse>;
  setCount(id: string, count: number): Promise<LightResponse>;
  setColor(
    id: string,
    colors: string[],
    pattern?: Pattern,
    timeout?: number,
  ): Promise<LightResponse>;
  setBrightness(id: string, brightness: number): Promise<LightResponse>;
  addTags(id: string, tags: string[]): Promise<LightResponse>;
  removeTags(id: string, tags: string[]): Promise<LightResponse>;
}>({
  fetchLight: () => new Promise<AxiosResponse>((): void => {}),
  setStatus: () => new Promise<AxiosResponse>((): void => {}),
  setName: () => new Promise<AxiosResponse>((): void => {}),
  setCount: () => new Promise<AxiosResponse>((): void => {}),
  setColor: () => new Promise<AxiosResponse>((): void => {}),
  setBrightness: () => new Promise<AxiosResponse>((): void => {}),
  addTags: () => new Promise<AxiosResponse>((): void => {}),
  removeTags: () => new Promise<AxiosResponse>((): void => {}),
});

export interface LightProviderProps {
  children?: JSX.Element;
}

export default function LightProvider(props: LightProviderProps): JSX.Element {
  const dispatch = useDispatch();
  const snackbar = useSnackbar();
  const theme = useTheme();

  async function fetchLight(id: string): Promise<LightResponse> {
    const ax = Axios.get(`/lights/${id}`);
    ax.then((res: LightResponse) => {
      dispatch(setLight(id, res.data.object));
    });
    return await ax;
  }

  async function setStatus(
    id: string,
    status: boolean,
  ): Promise<LightResponse> {
    const ax = Axios.patch(`/lights/${id}/${status ? "on" : "off"}`);
    ax.then((res: LightResponse) => {
      snackbar.makeSnackbar(res.data.message, theme.colors.success);
      dispatch(setLightStatus(id, status));
    });
    ax.catch((err: AxiosError) => {
      snackbar.makeSnackbar(err.response?.data.message, theme.colors.error);
    });
    return await ax;
  }

  async function setName(id: string, name: string): Promise<LightResponse> {
    const ax = Axios.patch(`/lights/${id}/update`, {
      name,
    });
    ax.then((res: LightResponse) => {
      snackbar.makeSnackbar(res.data.message, theme.colors.success);
      dispatch(editLightName(id, name));
    });

    ax.catch((err: AxiosError) => {
      snackbar.makeSnackbar(
        err?.response?.data.message ?? "Nothing changed",
        theme.colors.error,
      );
    });
    return await ax;
  }

  async function setCount(id: string, count: number): Promise<LightResponse> {
    const ax = Axios.patch(`/lights/${id}/count`, {
      count,
    });
    ax.then((res: LightResponse) => {
      snackbar.makeSnackbar(res.data.message, theme.colors.success);
      dispatch(setLedCount(id, count));
    });
    ax.catch((err: AxiosError) => {
      snackbar.makeSnackbar(
        err?.response?.data.message ?? "Nothing changed",
        theme.colors.error,
      );
    });
    return await ax;
  }

  async function setColor(
    id: string,
    colors: string[],
    pattern?: Pattern,
    timeout?: number,
  ): Promise<LightResponse> {
    const ax = Axios.patch(
      `/lights/${id}/color`,
      {
        colors,
        pattern,
        timeout,
      },
      {
        timeout: 3000,
      },
    );
    ax.then((res: LightResponse) => {
      if (res.status === 304) {
        snackbar.makeSnackbar("Nothing changed", theme.colors.error);
      } else if (res.status === 200) {
        snackbar.makeSnackbar(res.data.message, theme.colors.success);
        dispatch(
          setLightColor(
            id,
            pattern ?? "plain",
            colors.length > 0 ? colors : res.data.object.leds.colors,
            timeout,
          ),
        );
      }
    });
    ax.catch((err: AxiosError) => {
      snackbar.makeSnackbar(
        err?.response?.data.message ?? "Nothing changed",
        theme.colors.error,
      );
    });
    return await ax;
  }

  async function setBrightness(
    id: string,
    brightness: number,
  ): Promise<LightResponse> {
    const ax = Axios.patch(`/lights/${id}/brightness`, {
      brightness: Math.round(brightness),
    });
    ax.then(() => {
      dispatch(setLightBrightness(id, brightness));
    });
    return await ax;
  }

  async function addTags(id: string, tags: string[]): Promise<LightResponse> {
    const ax = Axios.put(`/lights/${id}/tags`, {
      tags,
    });
    ax.then(() => {
      fetchLight(id);
    });
    ax.catch((err: AxiosError) => {
      snackbar.makeSnackbar(
        err.response?.data.message ?? "an error orcurrred",
        theme.colors.error,
      );
    });

    return await ax;
  }

  async function removeTags(
    id: string,
    tags: string[],
  ): Promise<LightResponse> {
    const ax = Axios.delete(`/lights/${id}/tags`, {
      data: { tags },
    });
    ax.then(() => {
      fetchLight(id);
    });
    ax.catch((err: AxiosError) => {
      snackbar.makeSnackbar(
        err.response?.data.message ?? "an error orcurrred",
        theme.colors.error,
      );
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
        addTags,
        removeTags,
      }}
    >
      {children}
    </LightContext.Provider>
  );
}
