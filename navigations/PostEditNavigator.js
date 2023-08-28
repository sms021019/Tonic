import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {ScreenType} from "../utils/utils";
import PostEditScreen from '../screens/PostEditScreen'

const Stack = createStackNavigator();

export default function PostEditNavigator({route}) {
    const {postId} = route.params;

    return (
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name={ScreenType.POST_EDIT}>
                {props => <PostEditScreen {...props} postId={postId} /> }
            </Stack.Screen>
        </Stack.Navigator>
    )
}
