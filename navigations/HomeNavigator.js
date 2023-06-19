import React from 'react'
import {Image, Text, View} from 'react-native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Content from '../screens/ContentScreen';
import Chat from "../screens/Chat";
import MyPage from '../screens/MyPage';
import Channel from '../screens/Channel';
import SearchScreen from "../screens/SearchScreen";
import {Flex} from "native-base";
import ChatNavigator from './ChatNavigator';

const Tab = createBottomTabNavigator();
export default function HomeNavigator() {
    return (
        <Tab.Navigator screenOptions={{headerShown: true}}>
            <Tab.Screen name="Content" component={Content} />
            <Tab.Screen name="Chat" component={ChatNavigator} options={{headerShown: false}}/>
            <Tab.Screen name="MyPage" component={MyPage} />
        </Tab.Navigator>
    )
}

