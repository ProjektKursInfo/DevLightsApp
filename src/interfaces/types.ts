export type ThemeType = "Light" | "Dark" | "System-Default";

/**
 * Types for the LightsNavigator
 */
export type LightsStackParamList = {
  home: undefined;
  light: {
    id: string;
  };
  color_modal: {
    color: string;
    onSubmit: (color: string) => Promise<boolean>;
    index?: number;
  };
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
};
/**
 * Types for Alarm Navigator
 */
export type AlarmStackParamList = {
  home: undefined;
  color_modal: {
    color: string;
    onSubmit: (color: string) => Promise<boolean>;
    index?: number;
  };
};
