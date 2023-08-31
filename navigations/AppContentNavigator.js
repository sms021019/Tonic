import {createStackNavigator} from "@react-navigation/stack";
import {NavigatorType, ScreenType} from "../utils/utils";
import HomeNavigator from "./HomeNavigator";
import React from "react";
import SearchNavigator from "./SearchNavigator";
import ContentDetailNavigator from "./ContentDetailNavigator";
import PostCreateNavigator from "./PostCreateNavigator";
import PostEditNavigator from "./PostEditNavigator";
import EditProfileNavigator from "./EditProfileNavigator";
import SettingNavigator from "./SettingNavigator";

const Stack = createStackNavigator();


export default function AppContentNavigator() {

    return (
        <Stack.Navigator>
            <Stack.Screen name={NavigatorType.HOME} component={HomeNavigator} options={{title: ""}}/>
            <Stack.Screen name={NavigatorType.SEARCH} component={SearchNavigator} />
            <Stack.Screen name={NavigatorType.CONTENT_DETAIL} component={ContentDetailNavigator}/>
            <Stack.Screen name={NavigatorType.POST_CREATE} component={PostCreateNavigator}/>
            <Stack.Screen name={NavigatorType.POST_EDIT} component={PostEditNavigator}/>
            <Stack.Screen name={NavigatorType.EDIT_PROFILE} component={EditProfileNavigator}/>
            <Stack.Screen name={NavigatorType.SETTING} component={SettingNavigator}/>
        </Stack.Navigator>
    )
}
