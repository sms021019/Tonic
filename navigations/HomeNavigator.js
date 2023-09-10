import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Feather} from "@expo/vector-icons";
import ContentScreen from '../screens/ContentScreen';
import MyPage from '../screens/MyPage';
import {ScreenType} from '../utils/utils';
import LoadingScreen from "../screens/LoadingScreen";
import {useRecoilValue} from "recoil";
import {thisUser} from "../recoil/userState";
import ChannelScreen from "../screens/ChannelScreen";


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
    const /** @type {UserDoc} */ user = useRecoilValue(thisUser);

    if (!user) {
        return <LoadingScreen/>
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    return <Feather name={getIconNameByType(route.name)} size={size} color={color} />;
                },
        })}>
            <Tab.Screen name={ScreenType.CONTENT} options={{title: "Home"}} component={ContentScreen}/>
            <Tab.Screen name={ScreenType.CHANNEL} options={{headerShown: false, title: "Chat"}} component={ChannelScreen}/>
            <Tab.Screen name={ScreenType.MYPAGE} options={{headerTransparent: true, title: "My", headerTitle: ""}} component={MyPage}/>
        </Tab.Navigator>
    )
}
