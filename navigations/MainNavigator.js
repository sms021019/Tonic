import React from 'react'
import {View, Text} from 'react-native'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import StartNavigator from "./StartNavigator"
import HomeNavigator from './HomeNavigator'
import ContentDetailNavigator from "./ContentDetailNavigator"
import PostingNavigator from './PostingNavigator'
import {NavigatorType} from '../utils/utils.js'

const Stack = createStackNavigator();

export default function MainNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={NavigatorType.LOGIN} component={StartNavigator}/>
            <Stack.Screen name={NavigatorType.HOME} component={HomeNavigator} options={{title: ""}}/>
            <Stack.Screen name={NavigatorType.CONTENT_DETAIL} component={ContentDetailNavigator} options={{title: "", headerShown: true}}/>
            <Stack.Screen name={NavigatorType.POSTING} component={PostingNavigator}/>
        </Stack.Navigator>
    )
}