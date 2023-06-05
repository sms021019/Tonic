import { useState, useEffect, useContext, createContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack'

import Channel from '../screens/Channel';
import Chat from '../screens/Chat';


const Stack = createStackNavigator();


export default function StartNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Channel" component={Channel} />
      <Stack.Screen name="Chat" component={Chat}/>
    </Stack.Navigator>
  )
}