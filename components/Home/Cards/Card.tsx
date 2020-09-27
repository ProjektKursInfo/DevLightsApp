import * as React from 'react';
import { Component } from 'react';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

export interface CardProps {
    /**
     * The IP of the ESP Card
     */
    ip: string,
    /**
     * Name of the Device
     */
    name?: string,
    /**
     * The color of the card
     */
    color?: string,
    style?: StyleProp<ViewStyle>
}
 
export interface CardState {
    
}
 
export default function Card(props: CardProps) {
    const {ip,name,color,style} = props;
    const fullStyle = {
        ...style,
        backgroundColor: color ?  color : undefined
    }
    return ( 
            <PaperCard style={fullStyle}> 
                <PaperCard.Title title={name ? name : ip}> </PaperCard.Title>
            </PaperCard>
         );
}