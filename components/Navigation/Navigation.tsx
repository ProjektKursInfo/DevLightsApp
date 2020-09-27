import * as React from 'react';
import { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../Home/Home';
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

export interface NavigationProps {
    
}
 
export interface NavigationState {
    
}

export interface NavigationProps {
    
}
 
export default function Navigation(props: object) {
    return ( 
        <NavigationContainer>
        <Drawer.Navigator>
            <Drawer.Screen component={Home} name="Home"></Drawer.Screen>
        </Drawer.Navigator>
        </NavigationContainer>
     );
}
