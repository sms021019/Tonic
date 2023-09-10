
// React
import React, { useState } from 'react';
// Util
import { NavigatorType } from '../utils/utils';
// recoil
import { useRecoilValue } from 'recoil';
import { chatroomHeaderIdsAtomByEmail } from '../recoil/chatroomHeaderState';
import {thisUser} from "../recoil/userState";
import ChatroomHeaderFlatList from './ChatroomHeaderFlatList';

export default function Channel({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const /**@type {UserDoc}*/ user = useRecoilValue(thisUser);
    const chatroomHeaderIds = useRecoilValue(chatroomHeaderIdsAtomByEmail(user.email));

    console.log(user.email);
    console.log("chatroomHeaderIds:", chatroomHeaderIds);

    function handleRefresh() {
        setRefreshing(true)
    }

    function handleContentClick(chatroomId) {
        if (!chatroomId) return;
        navigation.navigate(NavigatorType.CHAT, {chatroomId: chatroomId});
    }

/* ------------------
    Render
-------------------*/
    return (
        <ChatroomHeaderFlatList
            chatroomHeaderIds={chatroomHeaderIds}
            handleClick={handleContentClick}
            handleRefresh={handleRefresh}
            refreshing={refreshing}
        />
    );
};
