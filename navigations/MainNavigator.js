import { useState, useEffect, useContext, createContext } from 'react';
import {View, Text, ActivityIndicator} from 'react-native'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import StartNavigator from "./StartNavigator"
import HomeNavigator from './HomeNavigator'
import ContentDetailNavigator from "./ContentDetailNavigator";

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const Stack = createStackNavigator();

export const AuthenticatedUserContext = createContext();

export const AuthenticatedUserProvider = ( props ) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{user, setUser}}>
      {props.children}
    </AuthenticatedUserContext.Provider>
  )
}

export default function MainNavigator() {
    const { user, setUser } = useContext(AuthenticatedUserContext);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,
            async authenticatedUser => {
                authenticatedUser ? setUser(authenticatedUser) : setUser(null);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, [user]);

    if(loading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator/>
            </View>
        )
    }

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            { user ? 
            <Stack.Screen name="HomeNavigator" component={HomeNavigator}/> 
            : 
            <Stack.Screen name="LoginNavigator" component={StartNavigator}/>
            }
            <Stack.Screen name="ContentDetailNavigator" component={ContentDetailNavigator}  options={{title: "", headerShown: false}}/>
        </Stack.Navigator>
    )
}