import {useState, useEffect, useContext, createContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack'

import Channel from '../screens/Channel';
import Chat from '../screens/Chat';
import {ScreenType} from "../utils/utils";
import NewUserSearchScreen from '../screens/NewUserSearchScreen';

const Stack = createStackNavigator();


export default function ChatNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name = {ScreenType.CHANNEL}>
                {props => <Chat {...props} chatroomId = {chatroomId}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
}