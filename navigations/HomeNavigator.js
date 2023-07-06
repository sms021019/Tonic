import React, {useState} from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Feather, Ionicons} from "@expo/vector-icons";
import Content from '../screens/ContentScreen';
import Chat from "../screens/Chat";
import MyPage from '../screens/MyPage';
import ChatNavigator from './ChatNavigator';
import {NavigatorType, ScreenType} from '../utils/utils';

function getIconNameByType(type) {
    if (type === ScreenType.CONTENT)
        return 'home'
    if (type === NavigatorType.CHAT)
        return 'message-circle'
    if (type === ScreenType.MYPAGE)
        return 'user'
}


const Tab = createBottomTabNavigator();
export default function HomeNavigator({route}) {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    return <Feather name={getIconNameByType(route.name)} size={size} color={color} />;
                },
        })}>
            <Tab.Screen name={ScreenType.CONTENT} options={{title: "Home"}}>
                {props => <Content {...props} />}
            </Tab.Screen>
            <Tab.Screen name={NavigatorType.CHAT} options={{headerShown: false, title: "Chat"}}>
                {props => <ChatNavigator {...props}/>}
            </Tab.Screen>
            <Tab.Screen name={ScreenType.MYPAGE} options={{headerShown: false, title: "Chat"}}>
                {props => <MyPage {...props} />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}
