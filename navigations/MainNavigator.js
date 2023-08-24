// React
import React, {useState, useEffect, useContext, createContext} from 'react';
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
import EmailVerification from '../screens/EmailVerification';
import SettingNavigator from "./SettingNavigator";
import EditProfileNavigator from "./EditProfileNavigator";
// Firebase
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../firebase';
// Global Context
import GlobalContext from '../context/Context';
import UserModel from "../models/UserModel";
import LoadingScreen from "../screens/LoadingScreen";

const Stack = createStackNavigator();

export default function MainNavigator() {
    const {user, setUser, gUserModel} = useContext(GlobalContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,
            async authenticatedUser => {
                if (authenticatedUser) {
                    setUser(authenticatedUser)
                    gUserModel.set(await UserModel.loadDataByAuth(authenticatedUser));
                }
                else {
                    setUser(null);
                }
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, [user]);

    if (loading) {
        return (
            <LoadingScreen/>
        )
    }


/* ---------------------
         Render
 ----------------------*/
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            { user ? user.emailVerified ?
            <Stack.Screen name={NavigatorType.HOME} component={HomeNavigator} options={{title: ""}}/> :
            <Stack.Screen name={NavigatorType.EMAIL} component={EmailVerification} options={{headerShown: true}}/> :
            <Stack.Screen name={NavigatorType.LOGIN} component={StartNavigator}/>
            }
            <Stack.Screen name={NavigatorType.SEARCH} component={SearchNavigator} />
            <Stack.Screen name={NavigatorType.CONTENT_DETAIL} component={ContentDetailNavigator}/>
            <Stack.Screen name={NavigatorType.POST_CREATE} component={PostCreateNavigator}/>
            <Stack.Screen name={NavigatorType.POST_EDIT} component={PostEditNavigator}/>
            <Stack.Screen name={NavigatorType.EDIT_PROFILE} component={EditProfileNavigator}/>
            <Stack.Screen name={NavigatorType.SETTING} component={SettingNavigator}/>
        </Stack.Navigator>
    )
}
