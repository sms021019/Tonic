
// React
import React, { useEffect, useState } from 'react';
// Design
import { Icon, Button, Divider } from '@rneui/base';
import { Center } from "../utils/styleComponents";
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from "styled-components/native";

// Util
import { NavigatorType, ScreenType } from '../utils/utils';
import CreateChatroomModal from '../components/CreateChatroomModal';
// recoil
import { useRecoilValue } from 'recoil';
import { chatroomHeaderIdsAtomByEmail } from '../recoil/chatroomHeaderState';
import {userAtom, userAtomByEmail} from "../recoil/userState";

import ChatroomHeaderFlatList from '../components/ChatroomHeaderFlatList';
import ChatroomHeaderController from '../typeControllers/ChatroomHeaderController';

export default function Channel({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState('');

    const user = useRecoilValue(userAtom);
    const chatroomHeaderIds = useRecoilValue(chatroomHeaderIdsAtomByEmail(user.email));


    console.log(user.email);
    console.log("chatroomHeaderIds:", chatroomHeaderIds);

    function handleRefresh() {
        setRefreshing(true)
    }

    function openCreateChatroomModal() {
        setModalVisible(true);
    }

    function handleCreateChatroom () {
        return;
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
            <CreateChatroomModal 
                state = {modalVisible} 
                setState = {setModalVisible} 
                email={email} 
                setEmail = {setEmail} 
                handleCreateChatroom = {handleCreateChatroom}
            />
            <TopContainer>
                <UsernameContainer>
                    <UsernameText>{user?.username}</UsernameText>
                </UsernameContainer>
                <FormButtonContainer>
                    <Button type="clear" onPress={openCreateChatroomModal}>
                        <Icon
                            name='sc-telegram'
                            type='evilicon'
                            color='black'
                            size={40}
                        />
                    </Button>
                </FormButtonContainer>
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


