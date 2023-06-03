import React from 'react'
import {View, Text} from 'react-native'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import ContentDetail from '../screens/ContentDetail'

const Stack = createStackNavigator();

export default function ContentDetailNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="ContentDetail" component={ContentDetail} />
        </Stack.Navigator>
    )
}