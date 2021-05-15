import { Pattern } from "@devlights/types";
import { AxiosResponse } from "axios";
import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { makeValidColorArray } from "../../utils";
import GradientComponent from "../GradientComponent";
import PlainComponent from "../PlainComponent";
import RainbowComponent from "../RainbowComponent";
import RunnerComponent from "../RunnerComponent";

export interface PatternComponentProps {
  pattern: Pattern;
  colors: string[];
  timeout: number | undefined;
  disabled: boolean;
  onSubmit: (
    colors: string[],
    timeout: number | undefined,
  ) => Promise<AxiosResponse>;
}

export default function PatternComponent(
  props: PatternComponentProps,
): JSX.Element {
  const { pattern, colors, disabled, timeout } = props;
  const styles = StyleSheet.create({
    text: {
      textAlign: "center",
    },
  });

  const onSubmit = async (
    newColor: string | string[],
    newTimeout?: number,
    index?: number,
  ): Promise<boolean> => {
    let success = true;
    const newColors =
      typeof newColor === "string"
        ? makeValidColorArray(
            typeof newColor === "string" ? newColor : "",
            colors,
            index ?? 0,
          )
        : newColor;
    const as = props.onSubmit(
      newColors,
      newTimeout <= 0 ? timeout : newTimeout,
    );
    as.then((res: AxiosResponse) => {
      if (res.status === 304) success = false;
    }).catch(() => {
      success = true;
    });
    return success;
  };

  const getComponent = () => {
    switch (pattern) {
      case "gradient":
        return (
          <GradientComponent
            disabled={disabled}
            onSubmit={onSubmit}
            colors={colors}
          />
        );
      case "plain":
        return (
          <PlainComponent
            disabled={disabled}
            colors={colors}
            onSubmit={onSubmit}
          />
        );
      case "runner":
        return (
          <RunnerComponent
            disabled={disabled}
            colors={colors}
            timeout={timeout ?? 100}
            onSubmit={onSubmit}
          />
        );
      case "rainbow":
      case "fading":
        return (
          <RainbowComponent
            disabled={disabled}
            onSubmit={onSubmit}
            colors={colors}
            timeout={timeout ?? 100}
          />
        );
      default:
        return (
          <Text style={styles.text}>
            Changing color is not supported withing pattern
            {pattern}
          </Text>
        );
    }
  };

  return <>{getComponent()}</>;
}
