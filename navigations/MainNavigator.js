// React
import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack'
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
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebase";
import {userAuthAtom} from "../recoil/userState";
import {useRecoilValue} from "recoil";
import AppContentNavigator from "./AppContentNavigator";


const Stack = createStackNavigator();

const AccessStatus = {
    NO_ACCOUNT: "levelOfAccess_noAccount",
    EMAIL_NOT_VERIFIED: "levelOfAccess_emailNotVerified",
    VALID: "levelOfAccess_valid",
}

export default function MainNavigator() {
    const [userAuth, setUserAuth] = useRecoilValue(userAuthAtom);
    const [accessStatus, setAccessStatus] = useState(AccessStatus.NO_ACCOUNT);

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
                (accessStatus === AccessStatus.VALID) &&
                <Stack.Screen name={NavigatorType.APP_CONTENT} component={AppContentNavigator}>
            }
        </Stack.Navigator>
    )
}
