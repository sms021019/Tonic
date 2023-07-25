
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



export default function Channel({ navigation: {navigate}}) {
    const { user, gUserModel } = useContext(GlobalContext);    
    const [modalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState("");
    const {chatroomModelList} = useContext(GlobalContext);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [newChatroomModel, setNewChatroomModel] = useState();
    const [displayName, setDisplayName] = useState();

    state = {
        isModalVisible: modalVisible,
    };
    showModal = () => setModalVisible(true);
    hideModal = () => setModalVisible(false);
    
    const isFocused = useIsFocused()

    useEffect(() => {
        
        loadChatrooms();
    }, []);

    function handleRefresh() {
        setRefreshing(true)
        loadChatrooms();
    }

    const handleCreateChatroom = async () => {
        // 처리 대상
            if(!displayName || !gUserModel) {
                //TO DO
                console.log("Not proper user or Empty name");
                return false;
            }

        
            const newRoom = ChatroomModel.newEmpty();
            newRoom.setDisplayName(displayName);
            newRoom.setUser(prev => [...prev, user]); // 무튼 유저 추가..?

            newRoom.asyncSaveData();




            await chatroomModel.asyncSaveData().then( ref => {
                if(ref){
                    console.log(ref)
                    setEmail('');
                    setModalVisible(prev => !prev);
                    chatroomModel.setRef(ref);
                    navigate(ScreenType.CHAT, {ref: ref});
                }else{
                    setHasError(true);
                    return;
                }
            })
    
    }

    async function loadChatrooms() {

        let dest = []
        if(await ChatroomModel.listChatrooms(gUserModel, dest, chatroomModelList) === false){
            setHasError(true);
            return;
        }
        // console.log(dest);
        // chatroomModelList.set(dest);

        // let currentUserRef = [];
        //     if(await DBHelper.getDocRefById(DBCollectionType.USERS, user?.email, currentUserRef) === false){
        //         //TO DO
        //         setHasError(true);
        //         return;
        //     }else{
        //         currentUserRef = currentUserRef[0];
        //     }

        // let chatroomData = [];
        // if (await ChatroomModel.loadAllData(currentUserRef, /* OUT */ chatroomData) === false) {
        //     setHasError(true);
        //     return;
        // }
        // chatroomModelList.set(chatroomData)
        setLoading(false);
        setRefreshing(false);
    }

    function handleContentClick(doc_id, index) {
        if (doc_id === -1 || !doc_id) return;
        navigate(ScreenType.CHAT, {doc_id: doc_id, index: index});
    }

    //어제 노트: 채팅하기 빠르게 눌러도 한번만 실행되게하기, 이메일 존재여부 확인, 채팅목록창 스크롤
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

            <Modal
                visible={this.state.isModalVisible}
                dismiss={this.hideModal}
            >

                <View style={styles.modalView}>
                    <Text style={styles.modalText}>대화를 원하는 상대의 이메일을 입력해주세요</Text>
                    <Input shadow={2} _light={{
                        bg: "coolGray.100",
                        _hover: {
                            bg: "coolGray.200"
                        },
                        _focus: {
                            bg: "coolGray.200:alpha.70"
                        }
                    }} _dark={{
                        bg: "coolGray.800",
                        _hover: {
                            bg: "coolGray.900"
                        },
                        _focus: {
                            bg: "coolGray.900:alpha.70"
                        }
                    }} placeholder="이메일"
                        value={email}
                        onChangeText={text => setEmail(text.toLowerCase())}
                    />
                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={handleCreateChatroom}>
                        <Text style={styles.textStyle}>채팅하기</Text>
                    </TouchableOpacity>
                </View>

            </Modal>
            <TopContainer>
                <UsernameContainer>
                    <UsernameText>{user?.displayName}</UsernameText>
                </UsernameContainer>
                <FormButtonContainer>
                    <Button type="clear" onPress={this.showModal}>
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

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,

        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        marginTop: 20,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});


