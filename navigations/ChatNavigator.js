import {useState, useEffect, useContext, createContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack'

import Channel from '../screens/Channel';
import Chat from '../screens/Chat';
import {ScreenType} from "../utils/utils";

const Stack = createStackNavigator();


export default function ChatNavigator() {
    return (
        <Stack.Navigator options={{headerShown: false}}>
            <Stack.Screen name={ScreenType.CHANNEL} component={Channel} options={{headerShown: false}}/>
            <Stack.Screen name={ScreenType.CHAT} component={Chat} screenOptions={{headerShown: true}}/>
        </Stack.Navigator>
    )
}