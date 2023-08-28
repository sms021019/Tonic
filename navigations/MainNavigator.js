// React
import React, {useState, useEffect, useContext, createContext, useMemo} from 'react';
import {View, Text, ActivityIndicator} from 'react-native'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
// Navigator
import {NavigatorType} from '../utils/utils.js'
import StartNavigator from "./StartNavigator"
import HomeNavigator from './HomeNavigator'
import ContentDetailNavigator from "./ContentDetailNavigator"
import PostCreateNavigator from './PostCreateNavigator'
import PostEditNavigator from "./PostEditNavigator";
import SearchNavigator from './SearchNavigator'
import SettingNavigator from "./SettingNavigator";
import EditProfileNavigator from "./EditProfileNavigator";
import {userAtom, userAuthAtom} from "../recoil/userState.js";
import {useRecoilValue} from "recoil";

const Stack = createStackNavigator();

export default function MainNavigator() {

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={NavigatorType.LOGIN} component={StartNavigator}/>
            <Stack.Screen name={NavigatorType.HOME} component={HomeNavigator} options={{title: ""}}/>
            <Stack.Screen name={NavigatorType.SEARCH} component={SearchNavigator} />
            <Stack.Screen name={NavigatorType.CONTENT_DETAIL} component={ContentDetailNavigator}/>
            <Stack.Screen name={NavigatorType.POST_CREATE} component={PostCreateNavigator}/>
            <Stack.Screen name={NavigatorType.POST_EDIT} component={PostEditNavigator}/>
            <Stack.Screen name={NavigatorType.EDIT_PROFILE} component={EditProfileNavigator}/>
            <Stack.Screen name={NavigatorType.SETTING} component={SettingNavigator}/>
        </Stack.Navigator>
    )
}
