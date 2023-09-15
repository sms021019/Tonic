
import React, {useEffect, useState} from 'react'
import {Text, StyleSheet, TouchableOpacity} from "react-native";
import {Box, Center} from "native-base";
import styled from "styled-components/native";
import theme from '../utils/theme'
import UserController from "../typeControllers/UserController";
import AuthController from "../typeControllers/AuthController";
import {windowWidth} from "../utils/utils";
import {flexCenter, TonicButton} from "../utils/styleComponents";
import ProfileImageHelper from "../helpers/ProfileImageHelper";
import {showQuickMessage} from "../helpers/MessageHelper";
import {useSetRecoilState} from "recoil";
import {userAuthAtom} from "../recoil/userState";

const ADMIN_EMAIL = 'tonic.cs.acc@gmail.com';

const SignupScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [username, setUsername] = useState('');
    const [wrongEmailFormat, setWrongEmailFormat] = useState(false);
    const [wrongPasswordFormat, setWrongPasswordFormat] = useState(false);
    const setUserAuth = useSetRecoilState(userAuthAtom);

    async function asyncHandleSignUp() {
        if (isValidToSignUp() === false) {
            showQuickMessage("Please fill all fields.");
            return;
        }
        const /**@type {Account}*/ newAccount = {
            uid: null,
            email,
            password,
            username,
        }
        const newUserAuth = await AuthController.asyncCreateUserAuth(newAccount)
        if (!newUserAuth) return false;

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

        setUserAuth(newUserAuth);
    }

    function isValidToSignUp() {
        if (wrongPasswordFormat || wrongEmailFormat) return false;
        if (password !== repeatPassword) return false;
        if (username === "" || email === "" || password === "" || repeatPassword === "") return false;
        return true;
    }

    function onEmailChange(value) {
        setEmail(value);
        if (value === ADMIN_EMAIL) {
            setWrongEmailFormat(false)
            return;
        }

        const regex = /\.edu$/i;
        (value === "" || regex.test(value))? setWrongEmailFormat(false) : setWrongEmailFormat(true);
    }

    function onPasswordChange(value) {
        setPassword(value);
        // Minimum 8 characters, at least one letter and one number.
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/i;
        (value === "" || regex.test(value))? setWrongPasswordFormat(false) : setWrongPasswordFormat(true);
    }

    return (
        <Container>
            <TonicInputField placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none"/>
            <TonicInputField placeholder="Email" value={email} onChangeText={onEmailChange} autoCapitalize="none"/>
            {
                (wrongEmailFormat) &&
                <Center style={styles.warningArea}>
                    <Text style={styles.warningText}>
                        Must ends with '.edu'
                    </Text>
                </Center>
            }
            <TonicInputField placeholder="Password" value={password} onChangeText={onPasswordChange} secureTextEntry autoCapitalize="none"/>
            {
                (wrongPasswordFormat) &&
                <Center style={styles.warningArea}>
                    <Text style={styles.warningText}>
                        Minimum 8 characters, at least one letter and one number.
                    </Text>
                </Center>
            }
            <TonicInputField placeholder="Repeat password" value={repeatPassword} onChangeText={setRepeatPassword} secureTextEntry autoCapitalize="none"/>
            {
                (password !== repeatPassword) &&
                <Center style={styles.warningArea}>
                    <Text style={styles.warningText}>
                        Password not match.
                    </Text>
                </Center>
            }
            <Box marginBottom={5}/>
            <TouchableOpacity onPress={asyncHandleSignUp}>
                <Center style={styles.buttonArea}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </Center>
            </TouchableOpacity>
        </Container>
    )
}

export default SignupScreen;


const styles = StyleSheet.create({
    warningArea: {width: windowWidth*0.9, padding:5, marginBottom: 10, backgroundColor:'#ffbdbd'},
    warningText: {color:"#8a2020"},
    buttonArea: {backgroundColor:theme.colors.primary, width: windowWidth*0.9, height: 56, borderRadius:8},
    buttonText: {fontWeight:'600', fontSize:18, color: '#ffffff'},
})


const TonicInputField = styled.TextInput`
  border-bottom-color: ${theme.colors.primary};
  border-bottom-width: 2px;
  width: ${windowWidth * 0.9}px;
  height: 50px;
  margin-top: 20px;
`

const Container = styled.View`
  ${flexCenter};
  background-color: #fff;
  align-items: center;
  justify-content: flex-start;
`;

