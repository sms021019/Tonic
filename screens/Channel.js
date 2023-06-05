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
import { addDoc, collection, getDocs } from 'firebase/firestore';





export default function Channel({ navigation: {navigate}}) {
    const { user } = useContext(GlobalContext);
    const [modalVisible, setModalVisible] = useState(false);
    state = {
        isModalVisible: modalVisible,
    };
    showModal = () => setModalVisible(true);
    hideModal = () => setModalVisible(false);

    const [email, setEmail] = useState("");

    const handleCreateChat = async () => {
        try{
            var foundUserDocument;      // 임시 변수
            const userCollection = await getDocs(collection(db, "users"));
            userCollection?.forEach((doc) => {
                if (doc.data().email === email.toLowerCase()) {
                    foundUserDocument = doc;
                    console.log(`Found user:${'\nEmail: ' + doc.data().email + '\n'}username: ${doc.data().username + '\n'}uid: ${doc.data().uid}`)
                    setEmail('');
                    return;             // 여기서 채팅방으로 이동 id는 router.query로 보내면 되나..?
                }
            });
            foundUserDocument ? {} : alert("존재하지 않는 이메일입니다.");
        }catch(error){
            console.log(error)
        }
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
                    <UsernameText>{user.displayName}</UsernameText>
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
            <ListItem>

            </ListItem>
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
    font-size: 20x;
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


