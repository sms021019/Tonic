import React, { useState, useEffect, useRef, useContext } from 'react';
import { db, auth } from '../firebase';
import { View, StyleSheet, Pressable, Alert } from "react-native";
import { ListItem, Icon, Button, Divider } from '@rneui/base';
import styled from "styled-components/native";
import { flexCenter, Center } from "../utils/styleComponents";

import GlobalContext from '../context/Context';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from '../utils/modal';
import { 
    Input,
    Box,
    Heading,
    HStack,
    FlatList,
    VStack,
    Text,
    Avatar,
    Spacer

 } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { 
    addDoc, 
    collection, 
    getDoc, 
    getDocs, 
    runTransaction, 
    where, 
    writeBatch, 
    updateDoc, 
    arrayUnion, 
    setDoc, 
    query,
    doc,
    limit,
    onSnapshot,
    orderBy,
} from 'firebase/firestore';

import { DBCollectionType } from '../utils/utils';
import { transcode } from 'buffer';
import { ScreenType } from '../utils/utils';
import ChatroomModel from '../models/ChatroomModel';
import ErrorScreen from "./ErrorScreen";
import DBHelper from '../helpers/DBHelper';

import { useIsFocused } from '@react-navigation/native'




export const CreateChatroom = async (ref, user) => {
    console.log("creating new chatroom...");
        try{
            const transactionResult = await runTransaction(db, async(transaction) => {
                const oppUserDoc = await transaction.get(ref);
                if(!oppUserDoc.exists()){
                    throw "Opponent does not exist!";
                }
                if(oppUserDoc.data().email === user?.email){
                    throw "Can\'t make room by yourself!";
                }
                
                const chatroomsCol = collection(db, DBCollectionType.CHATROOMS);
                const chatroomRef = doc(chatroomsCol);
                const chatroomId = chatroomRef.id;
                const chatroom = {
                    ref: chatroomRef,
                    participants: [oppUserDoc.data().email, user.email]
                }

                transaction.set(chatroomRef, chatroom);

                

                transaction.update(ref, {
                    chatrooms: arrayUnion(chatroomRef)
                });

                transaction.update(doc(collection(db, DBCollectionType.USERS), user.email), {
                    chatrooms: arrayUnion(chatroomRef)
                });

                console.log("Transaction successfully committed!");
                console.log(chatroomRef);
                return chatroomRef;


            })
            return transactionResult
        }catch(error){
            console.log(error)
        }

}

export const ExitChatroom = async (ref, user) => {
    console.log("Exiting chatroom...");
    try{
        await runTransaction(db, async (transaction) => {
            const currentUserRef = doc(collection(db, DBCollectionType.USERS), user?.email);
            const currentUserDoc = await transaction.get(currentUserRef);
            
            const chatroomDoc = await transaction.get(ref);
            const currentUserEmail = currentUserDoc.data().email;

            if(!currentUserDoc.exists()){
                throw "User document does not exist!";
            }

            
            let copyOfUserChatrooms = currentUserDoc.data().chatrooms;
            let index = -1;
            for(let i = 0; i < copyOfUserChatrooms.length; i++){
                if(ref.id === copyOfUserChatrooms[i].id){
                    index = i;
                }
            }
            console.log(index);
    
            // console.log(currentUserDoc.data().chatrooms[0])
            if(index > -1) {
                copyOfUserChatrooms.splice(index, 1);
                transaction.update(currentUserRef, {
                    chatrooms: copyOfUserChatrooms,
                })
            }else{
                return Promise.reject("Sorry! Chatroom reference doesn't exist");
            }

            

            if(!chatroomDoc.exists()){
                throw "Chatroom document does not exist!";
            }

            let leftParticipants = chatroomDoc.data().participants.length;
            if( leftParticipants === 1){
                console.log("You are the last one in chatroom...\nTherefore, deleting this chatroom...");
                transaction.delete(ref);
            }else if( leftParticipants > 1){
                let copyOfParticipants = chatroomDoc.data().participants;
                let temp = copyOfParticipants.indexOf(currentUserEmail);
                console.log(temp);
                if( temp > -1) {
                    copyOfParticipants.splice(temp, 1);
                    transaction.update(ref, {
                        participants: copyOfParticipants,
                    })
                }else{
                    return Promise.reject("Sorry! User reference doesn't exist");
                }
            }else{
                throw "Please check number of participants"
            }
            

        });

        console.log("Transaction successfully committed!");
    }catch(error){
        console.error(error);
    }
}


export default function Channel({ navigation: {navigate}}) {
    const { user } = useContext(GlobalContext);
    const [modalVisible, setModalVisible] = useState(false);
    state = {
        isModalVisible: modalVisible,
    };
    showModal = () => setModalVisible(true);
    hideModal = () => setModalVisible(false);

    const [email, setEmail] = useState("");
    const [chatroomsData, setChatroomsData] = useState([]);
    const [loading, setLoading] = useState("true");
    const [hasError, setHasError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // const currentUserRef = doc(db, `/users/${user?.email}`);
    const currentUserRef = doc(collection(db, DBCollectionType.USERS), user?.email);

    const isFocused = useIsFocused()


    useEffect(() => {
        if(isFocused){
            loadChatrooms();
        }
        
    }, [isFocused]);

    function handleRefresh() {
        setRefreshing(true)
        loadChatrooms();
    }

    const getChatroomByRef = async ref => {
        const chatroomSnapshot = await getDoc(ref);
        return chatroomSnapshot.data();
    }
    

    const handleCreateChatroom = async () => {
        if(email.length === 0){
            alert('Email can\'t be empty!');
        }else if(email === user?.email){
            alert('You can\'t type your email!');
        }else{
            const chatroomModel = new ChatroomModel(doc(collection(db, DBCollectionType.USERS), email), user);
            await chatroomModel.saveData().then( ref => {
                if(ref){
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
    }

    // const loadChatrooms = async () => {
    async function loadChatrooms() {
        // console.log("loading chatrooms...");
        // let tempArr = [];
        // let counter = 0;
        // getDoc(currentUserRef).then(doc => {
        //     if(doc.data().chatrooms.length === 0) {
        //         console.log("Currently there are no chatrooms");
        //         setChatroomsData(tempArr);
        //         setLoading("false");
        //         setRefreshing(false);
                
        //     }
        //     doc.data().chatrooms?.forEach(async (ref) => {
        //         const chatroom = await getChatroomByRef(ref);
        //         tempArr.push(chatroom);
        //         counter++;
        //         if(counter === doc.data().chatrooms.length){
        //             setChatroomsData(tempArr);
        //             setLoading("false");
        //             setRefreshing(false);
        //             console.log("loading end");
        //         }
        //         }
            
        //     );
        // });

        // const currentUserDoc = await DBHelper.loadData({ref: currentUserRef});
        let chatroomData = [];
        if (await ChatroomModel.loadAllData(currentUserRef, /* OUT */ chatroomData) === false) {
            // TO DO
            return;
        }

        setChatroomsData(chatroomData);
        setLoading("false");
        setRefreshing(false);
    }

    //어제 노트: 채팅하기 빠르게 눌러도 한번만 실행되게하기, 이메일 존재여부 확인, 채팅목록창 스크롤

    const Content = () => {
    if(loading === 'true'){
        return <Text m={2}>loading...</Text>
    }else if(loading === 'false'){
        return <ChatList2/>
    }
    }

    const ChatList2 = () => {

        return (
        <Box flex={1} px="0">
            
            <FlatList data={chatroomsData} renderItem={({
            item
            }) => 
            <TouchableOpacity onPress={() => navigate(ScreenType.CHAT, {ref: item.ref})}>
            <Box borderBottomWidth="1" _dark={{
            borderColor: "muted.50"
            }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2" m="2">
                    <HStack space={[2, 3]} justifyContent="space-between">
                    <Avatar size="48px" source={{
                uri: item.avatarUrl
                }} />
                    <VStack>
                        <Text _dark={{
                    color: "warmGray.50"
                }} color="coolGray.800" bold>
                        {item.participants[0] === user?.email ? item.participants[1] : item.participants[0]}
                        </Text>
                        <Text color="coolGray.600" _dark={{
                    color: "warmGray.200"
                }}>
                        {item.recentText}
                        </Text>
                    </VStack>
                    <Spacer />
                    <Text fontSize="xs" _dark={{
                color: "warmGray.50"
                }} color="coolGray.800" alignSelf="flex-start">
                        {item.timeStamp}
                    </Text>
                    </HStack>
                </Box>
                </TouchableOpacity>
                } 
                keyExtractor={(item, index) => 'key'+index}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                />
        </Box>
        );
    }


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
                <Content/>
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


