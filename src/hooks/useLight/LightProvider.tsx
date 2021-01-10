import { useNavigation } from "@react-navigation/native";
import Axios, { AxiosPromise } from "axios";
import * as React from "react";
import { Component } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Light } from "../../interfaces";
import { Store } from "../../store";
import { EDIT_LIGHT_COLOR } from "../../store/actions/types";

export const LightContext = React.createContext(null);

export interface LightProviderProps {
  children?: JSX.Element;
}

export default function LightProvider(props: LightProviderProps) : JSX.Element {
  const dispatch = useDispatch();

  async function setColor(
    id: string,
    new_color: string,
    second_color?: string,
    pattern?: string,
    index?: number,
  ): Promise<AxiosPromise> {

    const colors: string[] = second_color
      ? index === 0
        ? [new_color, second_color]
        : [second_color, new_color]
      : [new_color];

    const ax : Promise<AxiosPromise<any>> = Axios.patch(
      `http://devlight/${id}/color`,
      {
        colors: colors,
        pattern: colors.length > 1 ? "gradient" : "plain",
      },
    );
    ax.then(() => {
      dispatch({
        type: EDIT_LIGHT_COLOR,
        id: id,
        colors: colors,
      });
    });
    return await ax;
  }

  return (
    <LightContext.Provider
      value={{
        setColor,
      }}
    >
      {props.children}
    </LightContext.Provider>
  );
}
