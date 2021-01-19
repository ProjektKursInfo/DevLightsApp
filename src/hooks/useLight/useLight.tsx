import { AxiosPromise } from "axios";
import * as React from "react";
import { LightContext } from "./LightProvider";

export default function useLight() : React.ContextType<typeof LightContext> {
  return React.useContext<{
    setName(id: string, name: string): Promise<AxiosPromise<any>>;
    setCount(id: string, count: number): Promise<AxiosPromise<any>>;
    setColor(
      id: string,
      colors: string[],
      pattern?: string
    ): Promise<AxiosPromise>;
  }>(LightContext);
}
