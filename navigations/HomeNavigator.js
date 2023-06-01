import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {View, Text, SafeAreaView} from "react-native";
import Home from '../screens/Home';

const Stack = createStackNavigator();

export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  )
}