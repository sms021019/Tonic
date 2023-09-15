import React from 'react'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import ContentDetailScreen from '../screens/ContentDetailScreen'
import {ScreenType} from "../utils/utils";

const Stack = createStackNavigator();

export default function ContentDetailNavigator({route}) {
    const {events, postId} = route.params;

    return (
        // 'HeaderShown' must be initialized to FALSE (To prevent showing unintended header when the screen is loading).
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={ScreenType.CONTENT_DETAIL}>
                {props => <ContentDetailScreen {...props} postId={postId} event={events} />}
            </Stack.Screen>
        </Stack.Navigator>
    )
}
