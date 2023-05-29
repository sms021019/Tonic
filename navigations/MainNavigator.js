import React from 'react'
import { View, Text } from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'
import StartNavigator from "./StartNavigator"

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginNavigator" component={StartNavigator}/>
    </Stack.Navigator>
  )
}