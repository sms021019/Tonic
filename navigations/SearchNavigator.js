import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import SearchScreen from '../screens/SearchScreen'

const Stack = createStackNavigator();

export default function SearchNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
        </Stack.Navigator>
    )
}
