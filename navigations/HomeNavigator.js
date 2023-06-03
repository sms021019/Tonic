import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Content from '../screens/ContentScreen';
import Chat from "../screens/Chat";
import MyPage from '../screens/MyPage';

const Tab = createBottomTabNavigator();

export default function HomeNavigator() {
    return (
        <Tab.Navigator screenOptions={{headerShown: false}} tabBarOptions={{ showLabel: true }}>
            <Tab.Screen name="Content" component={Content}/>
            <Tab.Screen name="Chat" component={Chat}/>
            <Tab.Screen name="MyPage" component={MyPage}/>
        </Tab.Navigator>
    )
}

