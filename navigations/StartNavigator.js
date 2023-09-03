import {useState, useEffect, useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack'
import Intro from '../screens/Intro';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import PasswordReset from '../screens/passwordReset';
import EmailVerification from '../screens/EmailVerification';
import {NavigatorType, ScreenType} from '../utils/utils';
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebase";
import GlobalContext from "../context/Context";
import {useRecoilState, useRecoilValue} from "recoil";
import {userAuthAtom} from "../recoil/userState";


const Stack = createStackNavigator();


export default function StartNavigator() {

    return (
        <Stack.Navigator>
            <Stack.Screen name={ScreenType.INTRO} component={Intro} options={{headerShown: false}}/>
            <Stack.Screen name={ScreenType.LOGIN} component={Login} options={{title: "Login", headerShown: true, headerLeft: null}}/>
            <Stack.Screen name={ScreenType.SIGNUP} component={Signup} options={{title: "Sign in"}}/>
            <Stack.Screen name={ScreenType.PASSWORD_RESET} component={PasswordReset} options={{title: "Find password"}}/>
        </Stack.Navigator>
    )
}
