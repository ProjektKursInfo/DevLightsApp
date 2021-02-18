import { Pattern } from "@devlights/types";
import * as React from "react";
import { LightContext, LightResponse } from "./LightProvider";

export default function useLight() : React.ContextType<typeof LightContext> {
  return React.useContext<{
    fetchLight(id: string): Promise<LightResponse>;
    setStatus(id: string, status: boolean) : Promise<LightResponse>;
    setName(id: string, name: string): Promise<LightResponse>;
    setCount(id: string, count: number): Promise<LightResponse>;
    setColor(
      id: string,
      colors: string[],
      pattern?: Pattern
    ): Promise<LightResponse>;
    setBrightness(id: string, brightness: number): Promise<LightResponse>;
  }>(LightContext);
}
