
// React
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from "react-native";
// Design
import { Icon, Button, Divider } from '@rneui/base';
import { Center } from "../utils/styleComponents";
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
    Input,
    Box,
    HStack,
    FlatList,
    VStack,
    Text,
    Avatar,
    Spacer
} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from "styled-components/native";
// Modal
import Modal from '../utils/modal';
import GlobalContext from '../context/Context';
// Util
import { DBCollectionType } from '../utils/utils';
import { ScreenType } from '../utils/utils';
import ErrorScreen from "./ErrorScreen";
import DBHelper from '../helpers/DBHelper';
import { useIsFocused } from '@react-navigation/native'
// Model
import ChatroomModel from '../models/ChatroomModel';
import ChatList from '../components/ChatList';
import Loading from '../components/Loading';

import {doc} from "firebase/firestore";
import CreateChatroomModal from '../components/CreateChatroomModal';



export default function Channel({ navigation: {navigate}}) {
    const { user, gUserModel } = useContext(GlobalContext);    
    const [modalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState("");
    const {chatroomModelList} = useContext(GlobalContext);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [chatroomRefs, setChatroomRefs] = useState(null);

    useEffect(() => {
        ChatroomModel.onSnapshotGetUserChatroomRefs(gUserModel, setChatroomRefs);
    }, []);
    
    useEffect(() => {
        if(chatroomRefs === null) return;
        loadChatrooms();
    },[chatroomRefs]);

    function handleRefresh() {
        setRefreshing(true)
        loadChatrooms();
    }

    function openCreateChatroomModal() {
        setModalVisible(true);
    }

    function handleCreateChatroom () {
        return;
    }

    async function loadChatrooms() {
        let chatroomModelListBeforeSorting = await ChatroomModel.asyncChatroomRefsToModel(chatroomRefs);
        let sortedChatroomList = await ChatroomModel.sortChatroomModelsByRecentText(chatroomModelListBeforeSorting);
        chatroomModelList.set(sortedChatroomList);

        setLoading(false);
        setRefreshing(false);
    }

    function handleContentClick(doc_id, index) {
        if (doc_id === -1 || !doc_id) return;
        navigate(ScreenType.CHAT, {doc_id: doc_id, index: index});
    }

    const LoadingView = <View><Text>Loading...</Text></View>

    const ContentView = (
        <ChatList
            modelList={chatroomModelList}
            handleClick={handleContentClick}
            handleRefresh={handleRefresh}
            refreshing={refreshing}
        />
    )
        
    const Content = !user ? LoadingView : ContentView;

/* ------------------
    Error Screen
-------------------*/
if (hasError) return <ErrorScreen/>
if (loading) return <Loading/>

    return (
        <SafeAreaView style={{ display: 'flex', flex: 1 }}>


            <CreateChatroomModal state = {modalVisible} setState = {setModalVisible} email={email} setEmail = {setEmail} handleCreateChatroom = {handleCreateChatroom}/>
            <TopContainer>
                <UsernameContainer>
                    <UsernameText>{user?.displayName}</UsernameText>
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
                <MessageText>메시지</MessageText>
            </TopContainer>
            <ContentArea>
                {Content}
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


