// React
import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack'
// Navigator
import {NavigatorType, ScreenType} from '../utils/utils.js'
import StartNavigator from "./StartNavigator"
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebase";
import {thisUser, userAuthAtom} from "../recoil/userState";
import {useRecoilState, useRecoilValue} from "recoil";
import AppContentNavigator from "./AppContentNavigator";
import EmailVerification from "../screens/EmailVerification";
import {accessAtom, AccessStatus} from "../recoil/accessState";

const Stack = createStackNavigator();

export default function MainNavigator() {
    const user = useRecoilValue(thisUser);
    const [userAuth, setUserAuth] = useRecoilState(userAuthAtom);
    const [accessStatus, setAccessStatus] = useRecoilState(accessAtom);

    useEffect(() => {
        // Auto login: Skip authentication if previous login record exists.
        const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
            if (authenticatedUser && authenticatedUser?.emailVerified === true) {
                setAccessStatus(AccessStatus.VALID);
                setUserAuth(authenticatedUser)
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!userAuth) {
            setAccessStatus(AccessStatus.NO_ACCOUNT);
        }
        else if (userAuth.emailVerified === false) {
            setAccessStatus(AccessStatus.EMAIL_NOT_VERIFIED)
        }
        else {
            setAccessStatus(AccessStatus.VALID);
        }
    }, [userAuth])

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            {
                (accessStatus === AccessStatus.NO_ACCOUNT) &&
                <Stack.Screen name={NavigatorType.LOGIN} component={StartNavigator}/>
            }
            {
                (accessStatus === AccessStatus.EMAIL_NOT_VERIFIED) &&
                <Stack.Screen name={ScreenType.EMAIL_VERIFICATION} component={EmailVerification}/>
            }
            {
                (accessStatus === AccessStatus.VALID) &&
                <Stack.Screen name={NavigatorType.APP_CONTENT} component={AppContentNavigator}/>
            }
        </Stack.Navigator>
    )
}
