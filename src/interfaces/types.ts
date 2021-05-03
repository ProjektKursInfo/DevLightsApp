import { Light, Response } from "@devlights/types";
import { AxiosResponse } from "axios";

export type Theme = "Light" | "Dark" | "System-Default";
export type LightResponse = AxiosResponse<Response<Light>>;
export type ColorModal = {
  color: string;
  onSubmit: (color: string) => Promise<boolean>;
  index?: number;
};
/**
 * Types for the LightsNavigator
 */
export type LightsStackParamList = {
  home: undefined;
  light: {
    id: string;
  };
  color_modal: ColorModal;
  favourite: undefined;
};

/**
 * Types for the Tags Navigator
 */
export type TagsStackParamList = {
  home: undefined;
  tag: {
    tag: string;
  };
  color_modal: ColorModal;
};
/**
 * Types for Alarm Navigator
 */
export type AlarmStackParamList = {
  home: undefined;
  color_modal: ColorModal;
};
