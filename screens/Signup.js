
import React, {useState} from 'react'
import {flexCenter, TonicButton} from "../utils/styleComponents";
import theme from '../utils/theme'
import styled from "styled-components/native";
import {windowWidth} from "../utils/utils";
import { EMAIL_DOMAIN } from '../utils/utils';
import ErrorScreen from './ErrorScreen';
import UserController from "../typeControllers/UserController";
import AuthController from "../typeControllers/AuthController";


const SignupScreen = () => {
    const [email, setEmail] = useState(EMAIL_DOMAIN);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [hasError, setHasError] = useState(false);

    async function handleSignUp() {
        const /**@type {Account}*/ newAccount = {
            uid: null,
            email,
            password,
            username,
        }
        if (await AuthController.asyncCreateUserAuth(newAccount) === false) return false;

        const /**@type UserDoc*/ newUser = {
            uid: newAccount.uid,
            email: newAccount.email,
            username: newAccount.username,
            myPostIds: [],
            chatrooms: [],
            reportedUserEmails: [],
            reportedPostIds: [],
        }
        if (await UserController.asyncAddUser(newUser) === false) return false;
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
                <StartText>Sign up</StartText>
            </StartButton>
        </Container>
    )
}

export default SignupScreen;


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


const Container = styled.View`
  ${flexCenter};
  background-color: #fff;
  align-items: center;
  justify-content: flex-start;
`;
