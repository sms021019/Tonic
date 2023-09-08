
// React
import React, { useState } from 'react';
// Design
import { Divider } from '@rneui/base';
import { Center } from "../utils/styleComponents";
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from "styled-components/native";
// Util
import { NavigatorType } from '../utils/utils';
// recoil
import { useRecoilValue } from 'recoil';
import { chatroomHeaderIdsAtomByEmail } from '../recoil/chatroomHeaderState';
import {thisUser} from "../recoil/userState";
import ChatroomHeaderFlatList from '../components/ChatroomHeaderFlatList';

export default function Channel({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const user = useRecoilValue(thisUser);
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
        <SafeAreaView style={{ display: 'flex', flex: 1 }}>
            <TopContainer>
                <UsernameContainer>
                    <UsernameText>{user?.username}</UsernameText>
                </UsernameContainer>
            </TopContainer>
            <Divider />
            <TopContainer>
                <MessageText>Message</MessageText>
            </TopContainer>
            <ContentArea>
                <ChatroomHeaderFlatList
                    chatroomHeaderIds={chatroomHeaderIds}
                    handleClick={handleContentClick}
                    handleRefresh={handleRefresh}
                    refreshing={refreshing}
                />
            </ContentArea>
        </SafeAreaView>
    );
};


const ContentArea = styled.View`
  display: flex;
  flex: 1;
  background-color: #fff;
`;
const TopContainer = styled.View`
    display: flex;
    flex-direction: row;
`;
const UsernameContainer = styled.View`
    ${Center};
`
const UsernameText = styled.Text`
    padding: 20px;
    font-size: 30px;
    font-weight: 700;
`
const FormButtonContainer = styled.View`
    flex: 1;
    align-items: flex-end;
    justify-content: center;
    margin-right: 20px;
`
const MessageText = styled.Text`
    padding: 20px;
    font-size: 20px;
    font-weight: 700;
`


