// React
import React, { useState } from 'react';
// Util
import {NavigatorType, windowWidth} from '../utils/utils';
// recoil
import { useRecoilValue } from 'recoil';
import {safeChatroomHeaderIdsSelector} from '../recoil/chatroomHeaderState';
import {thisUser} from "../recoil/userState";
import ChatroomHeaderFlatList from './ChatroomHeaderFlatList';
import {Text, Image} from "react-native";
import {Center} from "native-base";

export default function Channel({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const /**@type {UserDoc}*/ user = useRecoilValue(thisUser);
    const chatroomHeaderIds = useRecoilValue(safeChatroomHeaderIdsSelector(user.email));

    function handleRefresh() {
        setRefreshing(true)
    }

    function handleContentClick(chatroomId) {
        if (!chatroomId) return;
        navigation.navigate(NavigatorType.CHAT, {chatroomId: chatroomId});
    }

    return (
        <>
            {
                (chatroomHeaderIds.length === 0)?
                <Center style={{width:'100%', height:'90%'}}>
                    <Image source={require("../assets/ChatIcon.png")} style={{width:windowWidth*0.3, height:windowWidth*0.3}} />
                    <Text style={{color:'gray'}}>No messages.</Text>
                </Center>
                :
                <ChatroomHeaderFlatList
                    chatroomHeaderIds={chatroomHeaderIds}
                    handleClick={handleContentClick}
                    handleRefresh={handleRefresh}
                    refreshing={refreshing}
                />
            }
        </>
    );
};
