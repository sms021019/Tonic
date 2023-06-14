import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile
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


const LoginScreen = () => {
    const [email, setEmail] = useState(EMAIL_DOMAIN);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');


    const handleSignUp = async () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async userCredentials => {
                const user = userCredentials.user;
                const usersCollectionRef = collection(db, 'users');
                await updateProfile(user, {displayName: username}).catch(
                    (err) => console.log(err)
                );
                // await addDoc(collection(db, "users"), {
                //     username: username,
                //     uid: user.uid,
                //     email: user.email,
                // });
                await setDoc(doc(usersCollectionRef, user.email), {
                    username: username,
                    uid: user.uid,
                    email: user.email,
                });

                const userCollection = await getDocs(collection(db, "users"));
                userCollection.forEach((doc) => {
                    if (doc.data().uid === user.uid) {
                        console.log(doc.data().username)
                    }
                });
                console.log('Registered in with: ', user.email);


            })
            .catch(error => alert(errorHandler(error)));

    }

    return (
        <Container>
            <UsernameInputField placeholder="Username" value={username} onChangeText={setUsername}/>
            <EmailInputField placeholder="Email" value={email} onChangeText={setEmail}/>
            <PasswordInputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry/>
            <StartButton onPress={handleSignUp}>
                <StartText>가입하기</StartText>
            </StartButton>
        </Container>
    )
}

export default LoginScreen;


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