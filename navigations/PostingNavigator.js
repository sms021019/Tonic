import React from 'react'
import {View, Text, TouchableOpacity, Button} from 'react-native'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import PostingScreen from '../screens/PostingScreen'
import {ScreenType} from "../utils/utils";
import ContentDetailScreen from "../screens/ContentDetailScreen";

const Stack = createStackNavigator();

export default function PostingNavigator({route}) {
    console.log(route.params);
    return (
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name="ContentDetail">
                {props => <PostingScreen {...props} mode={route?.params?.mode} contentData={route?.params?.data} /> }
            </Stack.Screen>
        </Stack.Navigator>
    )
}