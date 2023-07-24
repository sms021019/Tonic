import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import SettingScreen from '../screens/SettingScreen'
import ManageBlockedUserScreen from '../screens/ManageBlockedUserScreen'
import ManageBlockedPostScreen from '../screens/ManageBlockedPostScreen'
import {ScreenType} from "../utils/utils";

const Stack = createStackNavigator();

export default function SettingNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name={ScreenType.SETTING} component={SettingScreen} />
            <Stack.Screen name={ScreenType.MANAGE_BLOCKED_USER} component={ManageBlockedUserScreen} />
            <Stack.Screen name={ScreenType.MANAGE_BLOCKED_POST} component={ManageBlockedPostScreen} />
        </Stack.Navigator>
    )
}