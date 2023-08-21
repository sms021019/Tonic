import React from 'react'
import {View, Text} from 'react-native'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import ContentDetailScreen from '../screens/ContentDetailScreen'
import {ScreenType} from "../utils/utils";

const Stack = createStackNavigator();

export default function ContentDetailNavigator({route}) {
    const {events, postId} = route.params;

    return (
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name={ScreenType.CONTENT_DETAIL}>
                {props => <ContentDetailScreen {...props} postId={postId} event={events}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
}
