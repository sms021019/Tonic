import React, {useState, useEffect} from 'react'
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native'
import {flexCenter, TonicButton} from "../utils/styleComponents";
import theme from '../utils/theme'
import styled from "styled-components/native";
import {windowWidth} from "../utils/utils";

import { auth } from '../firebase';
import { sendPasswordResetEmail } from "firebase/auth";
import errorHandler from '../errors/index';



export default PasswordResetScreen = () => {
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState('none');

    const handleReset = () => {
        sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password reset email sent!
            console.log("Password reset email sent!")
            setEmail('');
            setEmailSent('block');
        })
        .catch(error => alert(errorHandler(error)))
    }

    return (
        <Container>
            <PasswordResetText>가입 시 사용한 이메일을 입력해주세요.</PasswordResetText>
            <EmailInputField placeholder="Email" value={email} onChangeText={setEmail}/>
            <StartButton onPress={handleReset}>
                <StartText>SEND</StartText>
            </StartButton>
            <ConfirmTextContainer style = {{display: emailSent}}>
                <ConfirmText>확인된 이메일로 비밀번호 재설정{"\n"}이메일이 전송되었습니다.{"\n"}이메일을 확인해주세요.</ConfirmText>
            </ConfirmTextContainer>
        </Container>
    )
}
const ConfirmTextContainer = styled.View`
    width: 60%;
    flex: 1;
    align-self: flex-start;
    margin-left: 20px;
`

const ConfirmText = styled.Text`
    margin-top: 40px;
    font-size: 18px;
    font-weight: 600;
`;

const PasswordResetText = styled.Text`
    margin-top: 40px;
    font-size: 18px;
    font-weight: 600;
`;

const EmailInputField = styled.TextInput`
  border-bottom-color: ${theme.colors.primary};
  border-bottom-width: 2px;
  width: ${windowWidth * 0.9}px;
  height: 50px;
  margin-bottom: 20px;
  margin-top: 20px;
`;

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

const Container = styled.View`
  ${flexCenter};
  background-color: #fff;
  align-items: center;
  justify-content: flex-start;
`;

