import React from 'react'
import {View, Text} from 'react-native'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import ContentDetailScreen from '../screens/ContentDetailScreen'

const Stack = createStackNavigator();

export default function ContentDetailNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="ContentDetail" component={ContentDetailScreen}/>
        </Stack.Navigator>
    )
}