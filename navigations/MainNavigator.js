import { useState, useEffect, useContext, createContext } from 'react';
import {View, Text, ActivityIndicator} from 'react-native'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import StartNavigator from "./StartNavigator"
import HomeNavigator from './HomeNavigator'
import ContentDetailNavigator from "./ContentDetailNavigator"
import PostingNavigator from './PostingNavigator'
import {NavigatorType} from '../utils/utils.js'

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import GlobalContext from '../context/Context';

const Stack = createStackNavigator();

export default function MainNavigator() {
    const { user, setUser } = useContext(GlobalContext);
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
            <Stack.Screen name={NavigatorType.HOME} component={HomeNavigator} options={{title: ""}}/> 
            : 
            <Stack.Screen name={NavigatorType.LOGIN} component={StartNavigator}/>
            }
            <Stack.Screen name={NavigatorType.CONTENT_DETAIL} component={ContentDetailNavigator} options={{title: "", headerShown: true}}/>
            <Stack.Screen name={NavigatorType.POSTING} component={PostingNavigator}/>
        </Stack.Navigator>
    )
}