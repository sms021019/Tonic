import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import SettingScreen from '../screens/SettingScreen'
import {ScreenType} from "../utils/utils";

const Stack = createStackNavigator();

export default function SettingNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name={ScreenType.SETTING} component={SettingScreen} />
        </Stack.Navigator>
    )
}