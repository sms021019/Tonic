import {useState, useEffect, useContext, createContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack'

import Channel from '../screens/Channel';
import Chat from '../screens/Chat';
import {ScreenType} from "../utils/utils";
import NewUserSearchScreen from '../screens/NewUserSearchScreen';

const Stack = createStackNavigator();


export default function ChatNavigator() {
    return (
        <Stack.Navigator options={{headerShown: false}}>
            <Stack.Screen name={ScreenType.CHANNEL} component={Channel} options={{headerShown: false}}/>
            <Stack.Screen name={ScreenType.CHAT} component={Chat} screenOptions={{headerShown: true}}/>
            <Stack.Screen name={ScreenType.USER_SEARCH} component={NewUserSearchScreen}/>
        </Stack.Navigator>
    )
}