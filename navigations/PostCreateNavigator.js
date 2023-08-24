import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import PostCreateScreen from '../screens/PostCreateScreen'
import {ScreenType} from "../utils/utils";

const Stack = createStackNavigator();

export default function PostCreateNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name={ScreenType.POST_CREATE} component={PostCreateScreen}/>
        </Stack.Navigator>
    )
}
