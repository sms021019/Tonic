import {useState, useEffect, useContext, createContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack'

import Channel from '../screens/Channel';
import Chat from '../screens/Chat';
import {ScreenType} from "../utils/utils";
import NewUserSearchScreen from '../screens/NewUserSearchScreen';

const Stack = createStackNavigator();


export default function ChatNavigator({route}) {
    const chatroomHeaderId = route.params;

    return (
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name = {ScreenType.CHAT}>
                {props => <Chat {...props} chatroomHeaderId = {chatroomHeaderId}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
}