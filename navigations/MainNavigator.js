import React from 'react'
import {View, Text} from 'react-native'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import StartNavigator from "./StartNavigator"
import HomeNavigator from './HomeNavigator'
import ContentDetailNavigator from "./ContentDetailNavigator";

const Stack = createStackNavigator();

export default function MainNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="LoginNavigator" component={StartNavigator}/>
            <Stack.Screen name="HomeNavigator" component={HomeNavigator}/>
            <Stack.Screen name="ContentDetailNavigator" component={ContentDetailNavigator}  options={{title: "", headerShown: false}}/>
        </Stack.Navigator>
    )
}