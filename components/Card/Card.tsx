import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { Card as PaperCard, Headline } from "react-native-paper";
import getContrastTextColor from "../textContrast/";

export interface CardProps {
  setup?: boolean;
  /**
   * The IP of the ESP Card
   */
  ip: string;
  /**
   * Name of the Device
   */
  name?: string;
  /**
   * The color of the card
   */
  color: string[];
  /**
   * The extra style of the Card
   */
  style?: object;
}

export interface CardState {}

export default function Card(props: CardProps): JSX.Element {
  const { ip, name, color, style } = props;
  const fullStyle = {
    ...style,

    backgroundColor: color ? color[0] : undefined,
  };
  return (
    <>
      {color.length > 1 ? (
        <LinearGradient
          style={[style, { borderRadius: 12 }]}
          colors={[color[0], color[1]]}
          start={[0, 1]}
          end={[1, 0]}
        >
          <Headline
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              color: getContrastTextColor(color[0]),
            }}
          >
            {name ? name : ip}
          </Headline>
        </LinearGradient>
      ) : (
        <PaperCard style={fullStyle}>
          <PaperCard.Title title={name ? name : ip}> </PaperCard.Title>
        </PaperCard>
      )}
    </>
  );
}
