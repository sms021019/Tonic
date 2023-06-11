import React, { useState, useEffect, useRef, useContext } from 'react';
import { db, auth } from '../firebase';
import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import { ListItem, Icon, Button, Divider } from '@rneui/base';
import styled from "styled-components/native";
import { flexCenter, Center } from "../utils/styleComponents";

import GlobalContext from '../context/Context';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from '../utils/modal';
import { Input } from 'native-base';
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

    const chatroomsColloection = collection(db, 'chatrooms');
    const usersCollectionRef = collection(db, 'users');



    useEffect(() => {
        const q = query(collection(db, 'chatrooms'), where("participants", "array-contains", user.uid));
        const unsubscribe = onSnapshot(q, snapshot => {
            setChatroomIds(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    emails: doc.data().participants
                    
                }))
            )
        });
        return () => unsubscribe();
    }, []);

    const handleCreateChat = async () => {
        try{
                const inputSnap = email.toLowerCase();
                

                const currentUserRef = doc(usersCollectionRef, user.email);
                const oppUserRef = doc(usersCollectionRef, inputSnap);

                const currentUserDoc = await getDoc(currentUserRef);
                const oppUserDoc = await getDoc(oppUserRef);
                
                if(currentUserDoc.empty || oppUserDoc.empty){
                    throw "Document does not exist!";
                }

                console.log(oppUserDoc.data());
                
                
                const newChatroomRef = await addDoc(chatroomsColloection,  {
                    participants: [user.email, oppUserDoc.data().email],
                });
                

                console.log("checkpoint");
                console.log(newChatroomRef.id);
                
                await updateDoc(currentUserRef, {
                    chatrooms: arrayUnion(newChatroomRef.id)
                })
                await updateDoc(oppUserRef, {
                    chatrooms: arrayUnion(newChatroomRef.id)
                })

        }catch(error){
            console.log("Create Chatroom failed: ", error)
        }finally {
            setEmail('');
        }
    }

    

    
    const ChatList = () => {
        
        // const chatroomsColloection = collection(db, 'chatrooms');

        return(chatroomIds.map(chatroom => {
                // const chatroomRef = doc(chatroomsColloection, chatroom);
                // const chatroomMessagesRef = collection(chatroomRef, "messages");
                // const q = query(chatroomMessagesRef, orderBy("createdAt", "desc"), limit(1));
                
                
                return(
                    <View key={chatroom.id}>
                        <Text>{chatroom.id}</Text>
                        <TouchableOpacity onPress={() => navigate('Chatroom', {id: chatroom.id})}>
                            <Text>Click me!</Text>
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
                        onChangeText={text => setEmail(text)}
                    />
                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={handleCreateChat}>
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
                <ChatList/>
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


