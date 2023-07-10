
import React, {useState, useEffect} from 'react'
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native'
import {flexCenter, TonicButton} from "../utils/styleComponents";
import theme from '../utils/theme'
import styled from "styled-components/native";
import {windowWidth} from "../utils/utils";


import { EMAIL_DOMAIN } from '../utils/utils';
import ErrorScreen from './ErrorScreen';
import UserModel from '../models/UserModel';


const LoginScreen = () => {
    const [email, setEmail] = useState(EMAIL_DOMAIN);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [hasError, setHasError] = useState(false);


    const handleSignUp = async () => {

        const userModel = new UserModel(username, email, password);
        if(await userModel.asyncCreateUser() === false){
            //TO DO
            setHasError(true);
            return;
        }
    }

    /* ------------------
        Error Screen
    -------------------*/
    if (hasError) return <ErrorScreen/>

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