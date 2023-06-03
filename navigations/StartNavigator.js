import { useState, useEffect, useContext, createContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import Intro from '../screens/Intro';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import PasswordReset from '../screens/passwordReset';



const Stack = createStackNavigator();


export default function StartNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Intro" component={Intro} options={{headerShown: false}}/>
      <Stack.Screen name="Login" component={Login} options={{headerShown: true, headerLeft: null}}/>
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="PasswordReset" component={PasswordReset} />
    </Stack.Navigator>
  )
}