// React
import React, { useState } from 'react';
import { View, StyleSheet } from "react-native";
import { 
    Input,
    Text,
} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
// Modal
import Modal from '../utils/modal';


export default function CreateChatroomModal(props) {
    const [email, setEmail] = useState('');
    const handleCreateChatroom = props.handleCreateChatroom? props.handleCreateChatroom : () => {} ;


    const state = props.state? props.state : false;
    const setState = props.setState? props.setState : ()=>{};

    return (
        <Modal
            visible={state}
            dismiss={() => setState(false)}
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
    );
}

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