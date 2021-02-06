import { AxiosResponse } from "axios";
import * as React from "react";
import { Pattern } from "../../interfaces/types";
import { LightContext } from "./LightProvider";

export default function useLight() : React.ContextType<typeof LightContext> {
  return React.useContext<{
    fetchLight(id: string): Promise<AxiosResponse<unknown>>;
    setStatus(id: string, status: boolean) : Promise<AxiosResponse<unknown>>;
    setName(id: string, name: string): Promise<AxiosResponse<unknown>>;
    setCount(id: string, count: number): Promise<AxiosResponse<unknown>>;
    setColor(
      id: string,
      colors: string[],
      pattern?: Pattern
    ): Promise<AxiosResponse<unknown>>;
    setBrightness(id: string, brightness: number): Promise<AxiosResponse<unknown>>;
  }>(LightContext);
}
