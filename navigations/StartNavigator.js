import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import Intro from '../screens/Intro';
import Login from '../screens/Login';
import Signup from '../screens/Signup';

const Stack = createStackNavigator();

export default function StartNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Intro" component={Intro} options={{headerShown: false}}/>
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
      <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}}/>
    </Stack.Navigator>
  )
}