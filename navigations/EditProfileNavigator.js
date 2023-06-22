import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import EditProfileScreen from '../screens/EditProfileScreen'
import {ScreenType} from "../utils/utils";

const Stack = createStackNavigator();

export default function EditProfileNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name={ScreenType.EDIT_PROFILE} component={EditProfileScreen} />
        </Stack.Navigator>
    )
}