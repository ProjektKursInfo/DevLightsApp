import * as React from "react";
import { LightContext } from "./LightProvider";
import { AxiosPromise } from "axios";

export default function useLights() {
  return React.useContext<{
    setColor(
    id: string,
    new_color: string,
    second_color?: string,
    pattern?: string,
    index?: number
    ) : Promise<AxiosPromise>;
  }>(LightContext);
}
