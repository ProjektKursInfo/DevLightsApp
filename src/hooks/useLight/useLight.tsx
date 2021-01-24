import { AxiosResponse } from "axios";
import * as React from "react";
import { LightContext } from "./LightProvider";

export default function useLight() : React.ContextType<typeof LightContext> {
  return React.useContext<{
    setName(id: string, name: string): Promise<AxiosResponse<unknown>>;
    setCount(id: string, count: number): Promise<AxiosResponse<unknown>>;
    setColor(
      id: string,
      colors: string[],
      pattern?: string
    ): Promise<AxiosResponse<unknown>>;
    setBrightness(id: string, brightness: number): Promise<AxiosResponse<unknown>>;
  }>(LightContext);
}
