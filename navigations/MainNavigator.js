// React
import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack'
// Navigator
import {NavigatorType, ScreenType} from '../utils/utils.js'
import StartNavigator from "./StartNavigator"
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebase";
import {userAuthAtom} from "../recoil/userState";
import {useRecoilState} from "recoil";
import AppContentNavigator from "./AppContentNavigator";
import EmailVerification from "../screens/EmailVerification";
import {accessAtom, AccessStatus} from "../recoil/accessState";

const Stack = createStackNavigator();

export default function MainNavigator() {
    const [userAuth, setUserAuth] = useRecoilState(userAuthAtom);
    const [accessStatus, setAccessStatus] = useRecoilState(accessAtom);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,
            async authenticatedUser => {
                if (!authenticatedUser) {
                    setAccessStatus(AccessStatus.NO_ACCOUNT);
                }
                else if (authenticatedUser.emailVerified === false) {
                    setAccessStatus(AccessStatus.EMAIL_NOT_VERIFIED)
                }
                else {
                    setAccessStatus(AccessStatus.VALID);
                }
                setUserAuth(authenticatedUser);
            }
        );
        return () => unsubscribe();
    }, []);

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
