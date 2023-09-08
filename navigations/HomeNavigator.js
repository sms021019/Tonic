import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Feather} from "@expo/vector-icons";
import ContentScreen from '../screens/ContentScreen';
import ChatScreen from "../screens/ChatScreen";
import MyPage from '../screens/MyPage';
import ChatNavigator from './ChatNavigator';
import {NavigatorType, ScreenType} from '../utils/utils';
import Channel from "../screens/Channel";


function getIconNameByType(type) {
    if (type === ScreenType.CONTENT)
        return 'home'
    if (type === ScreenType.CHANNEL)
        return 'message-circle'
    if (type === ScreenType.MYPAGE)
        return 'user'
}

const Tab = createBottomTabNavigator();
export default function HomeNavigator() {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    return <Feather name={getIconNameByType(route.name)} size={size} color={color} />;
                },
        })}>
            <Tab.Screen name={ScreenType.CONTENT} options={{title: "Home"}} component={ContentScreen}/>
            <Tab.Screen name={ScreenType.CHANNEL} options={{headerShown: false, title: "Chat"}} component={Channel}/>
            <Tab.Screen name={ScreenType.MYPAGE} options={{headerTransparent: true, title: "My", headerTitle: ""}} component={MyPage}/>
        </Tab.Navigator>
    )
}
