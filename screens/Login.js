import React, {useState} from 'react'
import {View, Text, TextInput} from 'react-native'
import {flexCenter, TonicButton} from "../utils/styleComponents";
import theme from '../utils/theme'
import styled from "styled-components/native";
import {windowWidth} from "../utils/utils";

export default function Login(navigation) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    // TODO: authentication.
    console.log("Login Button Clicked.")
  }


  return (
    <Container>
      <EmailInputField placeholder="Email" value={email} onChangeText={setEmail}/>
      <PasswordInputField placeholder="Password" value={password} onChangeText={setPassword}/>
      <OptionText>이메일 찾기 | 비밀번호 찾기 | 회원가입</OptionText>
      <StartButton onPress={handleLogin}>
        <StartText>로그인</StartText>
      </StartButton>
    </Container>
  )
}

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
