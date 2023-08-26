
import React, {useEffect, useState} from 'react'
import {Text, StyleSheet} from "react-native";
import {Center} from "native-base";
import styled from "styled-components/native";
import theme from '../utils/theme'
import UserController from "../typeControllers/UserController";
import AuthController from "../typeControllers/AuthController";
import {ProfileImageType, windowWidth} from "../utils/utils";
import {flexCenter, TonicButton} from "../utils/styleComponents";
import ErrorScreen from './ErrorScreen';
import ProfileImageHelper from "../helpers/ProfileImageHelper";


const SignupScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [wrongEmailFormat, setWrongEmailFormat] = useState(false);

    useEffect(() => {
        const regex = /\.edu$/i;
        if (email === "" || regex.test(email)) {
            setWrongEmailFormat(false);
        }
        else {
            setWrongEmailFormat(true);
        }
    }, [email])

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
            profileImageType: ProfileImageHelper.getRandomProfileImageType(),
            myPostIds: [],
            chatrooms: [],
            reportedUserEmails: [],
            reportedPostIds: [],
        }
        if (await UserController.asyncAddUser(newUser) === false) return false;
    }

    return (
        <Container>
            <UsernameInputField placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none"/>
            <EmailInputField placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none"/>
            {
                (wrongEmailFormat) &&
                <Center style={styles.warningArea}>
                    <Text style={styles.warningText}>
                        Email should ends with '.edu'
                    </Text>
                </Center>
            }
            <PasswordInputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none"/>
            <StartButton onPress={handleSignUp}>
                <StartText>Sign up</StartText>
            </StartButton>
        </Container>
    )
}

export default SignupScreen;


const styles = StyleSheet.create({
    warningArea: {width: windowWidth*0.9, padding:5, marginBottom: 10, backgroundColor:'#ffbdbd'},
    warningText: {color:"#8a2020"},
})


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
  margin-top: 20px;
`

const PasswordInputField = styled.TextInput`
  border-bottom-color: ${theme.colors.primary};
  border-bottom-width: 2px;
  width: ${windowWidth * 0.9}px;
  height: 50px;
  margin-top: 20px;
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
