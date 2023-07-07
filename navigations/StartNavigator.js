import {useState, useEffect, useContext, createContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack'
import Intro from '../screens/Intro';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import PasswordReset from '../screens/passwordReset';
import EmailVerification from '../screens/EmailVerification';
import { ScreenType } from '../utils/utils';


const Stack = createStackNavigator();


export default function StartNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name={ScreenType.INTRO} component={Intro} options={{headerShown: false}}/>
            <Stack.Screen name={ScreenType.LOGIN} component={Login} options={{title: "로그인", headerShown: true, headerLeft: null}}/>
            <Stack.Screen name={ScreenType.SIGNUP} component={Signup} options={{title: "회원가입"}}/>
            <Stack.Screen name={ScreenType.EMAIL_VERIFICATION} component={EmailVerification}/>
            <Stack.Screen name={ScreenType.PASSWORD_RESET} component={PasswordReset} options={{title: "비밀번호 찾기"}}/>
        </Stack.Navigator>
    )
}