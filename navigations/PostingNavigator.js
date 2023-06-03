import React from 'react'
import {View, Text, TouchableOpacity, Button} from 'react-native'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import PostingScreen from '../screens/PostingScreen'

const Stack = createStackNavigator();

export default function PostingNavigator() {

    return (
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen
                name="ContentDetail"
                component={PostingScreen}
                options={({navigation, route}) => ({
                    title: "포스팅",
                    headerRight: () => (
                        <Button title="Add"/>
                    ),
                })}
            />
        </Stack.Navigator>
    )
}