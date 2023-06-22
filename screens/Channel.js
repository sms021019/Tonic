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

export const CreateChatroom = async (ref, user) => {
    let errorMessage;
    console.log("creating new chatroom...");
        try{
            const oppUserDoc = await getDoc(ref);
    
            const chatroom = {
                participants: [oppUserDoc.data().email, user.email]
            }
    
            const chatroomRef = await addDoc(collection(db, 'chatrooms'), chatroom);
    
            await updateDoc(chatroomRef, {
                ref: chatroomRef
            })
            
            await updateDoc(ref, {
                chatrooms: arrayUnion(chatroomRef)
            })
            await updateDoc(doc(db, `/users/${user?.email}`), {
                chatrooms: arrayUnion(chatroomRef)
            })

            return chatroomRef;
        }catch(error){
            errorMessage = `Create Chatroom failed: ${error}`
        }finally{
            if(errorMessage){
                console.log(errorMessage);
            }else{
                console.log("Chatroom Created");
            }
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
    const [chatroomIds, setChatroomIds] = useState([]);
    const [chatroomsData, setChatroomsData] = useState([]);
    const [loading, setLoading] = useState("true");

    const chatroomsColloection = collection(db, 'chatrooms');
    const usersCollectionRef = collection(db, 'users');

    const currentUserRef = doc(db, `/users/${user?.email}`);


    useEffect(() => {
        if(chatroomsData.length === 0){
            loadChatrooms();
        }
    }, []);

    const getChatroomByRef = async ref => {
        const chatroomSnapshot = await getDoc(ref);
        return chatroomSnapshot.data();
    }
    

    const testCreatingChat = () => {
        CreateChatroom(doc(db, `/users/${email}`), user).then((ref) => {
            setEmail('');
            setModalVisible(prev => !prev);
            navigate('Chatroom', {ref: ref});
        })
    }

    const loadChatrooms = () => {
        console.log("loading chatrooms...");
        let tempArr = [];
        let counter = 0;
        getDoc(currentUserRef).then(doc => {
            doc.data().chatrooms?.forEach(async (ref) => {
                const chatroom = await getChatroomByRef(ref);
                tempArr.push(chatroom);
                counter++;
                console.log(`counter: ${counter}`)
                console.log(`tempArr: ${tempArr.length}`)
                if(counter === doc.data().chatrooms.length){
                    setChatroomsData(tempArr);
                    setLoading("false");
                    console.log("loading end");
                    
                }
                }
            
            );
        });
    }

    const Content = () => {
    if(loading === 'true'){
        return <Text>loading...</Text>
    }else if(loading === 'false'){
        return <ChatList/>
    }
    }


    
    const ChatList = () => {
        // console.log(chatroomsData.length);
        // const chatroomsColloection = collection(db, 'chatrooms');
        let count = 0;
        return(chatroomsData.map(chatroom => {
            
            count++;
            
            const oppEmail = chatroom?.participants?.map(email => {
                if(email !== user?.email){
                    return email;
                }
            })
            // console.log(oppEmail)
                
                return(
                    <View key={`chatroom${count}`}>
                        <TouchableOpacity onPress={() => navigate('Chatroom', {ref: chatroom.ref})}>
                        <Box borderBottomWidth="1" _dark={{
                            borderColor: "muted.50"
                            }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2" m="2">
                                    <HStack space={[2, 3]} justifyContent="space-between">
                                    <Avatar size="48px" source={{
                                uri: chatroom.profilePicture
                                }} />
                                    <VStack>
                                        <Text _dark={{
                                    color: "warmGray.50"
                                }} color="coolGray.800" bold>
                                        {oppEmail}
                                        </Text>
                                        <Text color="coolGray.600" _dark={{
                                    color: "warmGray.200"
                                }}>
                                        {chatroom.recentText}
                                        </Text>
                                    </VStack>
                                    <Spacer />
                                    <Text fontSize="xs" _dark={{
                                color: "warmGray.50"
                                }} color="coolGray.800" alignSelf="flex-start">
                                        {chatroom.timeStamp}
                                    </Text>
                                    </HStack>
                                </Box>
                                </TouchableOpacity>

                    </View>
                    )

            })
        )
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
                        onPress={testCreatingChat}>
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
            <View>
                <Content/>
            </View>
        </SafeAreaView>
    );
};


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


