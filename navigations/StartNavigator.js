import {useState, useEffect, useContext, createContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack'
import Intro from '../screens/Intro';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import PasswordReset from '../screens/passwordReset';
import EmailVerification from '../screens/EmailVerification';


const Stack = createStackNavigator();


export default function StartNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Intro" component={Intro} options={{headerShown: false}}/>
            <Stack.Screen name="Login" component={Login} options={{title: "로그인", headerShown: true, headerLeft: null}}/>
            <Stack.Screen name="Signup" component={Signup} options={{title: "회원가입"}}/>
            <Stack.Screen name="EmailVerification" component={EmailVerification}/>
            <Stack.Screen name="PasswordReset" component={PasswordReset} options={{title: "비밀번호 찾기"}}/>
        </Stack.Navigator>
    )
}