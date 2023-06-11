import {useState, useEffect, useContext, createContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack'

import Channel from '../screens/Channel';
import Chat from '../screens/Chat';


const Stack = createStackNavigator();


export default function ChatNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Channel" component={Channel} options={{headerShown: false}}/>
            <Stack.Screen name="Chatroom" component={Chat}/>
        </Stack.Navigator>
    )
}