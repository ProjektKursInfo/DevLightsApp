export type ThemeType = "light" | "dark" | "system-default";

/**
 * Types for the LightsNavigator
 */
export type LightsStackParamList = {
  home: undefined;
  light: {
    id: string;
  };
  color_modal: {
    id: string;
    index: number;
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
