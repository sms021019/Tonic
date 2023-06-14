import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile,
    sendSignInLinkToEmail,
    sendEmailVerification
} from 'firebase/auth';
import React, {useState, useEffect} from 'react'
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native'
import {flexCenter, TonicButton} from "../utils/styleComponents";
import theme from '../utils/theme'
import styled from "styled-components/native";
import {windowWidth} from "../utils/utils";


import {auth, db} from '../firebase';
import errorHandler from '../errors/index';
import {
  addDoc, 
  collection, 
  getDocs,
  setDoc,
  doc,
} from 'firebase/firestore';

import { EMAIL_DOMAIN } from '../utils/utils';


const EmailVerification = () => {
    const [email, setEmail] = useState(EMAIL_DOMAIN);
    // const [password, setPassword] = useState('');
    // const [username, setUsername] = useState('');


    const handleVerify = async () => {
        sendEmailVerification(auth, email, password)
            .then(async userCredentials => {
                
                console.log('Email verified');
            })
            .catch(error => alert(errorHandler(error)));

    }

    return (
        <Container>
            <UsernameInputField placeholder="Email" value={email} onChangeText={setEmail}/>
            <Text>{`Email verified: ${auth.currentUser.emailVerified}`}</Text>
            <StartButton onPress={handleVerify}>
                <StartText>VERIFY EMAIL</StartText>
            </StartButton>
        </Container>
    )
}

export default EmailVerification;


const UsernameInputField = styled.TextInput`
  border-bottom-color: ${theme.colors.primary};
  border-bottom-width: 2px;
  width: ${windowWidth * 0.9}px;
  height: 50px;
  margin-top: 20px;
`

const EmailInputField = styled.TextInput`
  border-bottom-color: ${theme.colors.primary};
  border-bottom-width: 2px;
  width: ${windowWidth * 0.9}px;
  height: 50px;
  margin-bottom: 20px;
  margin-top: 20px;
`

const PasswordInputField = styled.TextInput`
  border-bottom-color: ${theme.colors.primary};
  border-bottom-width: 2px;
  width: ${windowWidth * 0.9}px;
  height: 50px;
  margin-bottom: 20px;
`
const StartButton = styled.Pressable`
  ${TonicButton};
  width: ${windowWidth * 0.9}px;
  height: 56px;
  border-radius: 8px;
`;

const StartText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;

const OptionText = styled.Text`
  color: black;
  font-size: 12px;
  margin-bottom: 10px;
  color: ${theme.colors.foreground};
`

const Container = styled.View`
  ${flexCenter};
  background-color: #fff;
  align-items: center;
  justify-content: flex-start;
`;