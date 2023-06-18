import React, {useState, useEffect} from 'react'
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native'
import {flexCenter, TonicButton} from "../utils/styleComponents";
import theme from '../utils/theme'
import styled from "styled-components/native";
import {windowWidth} from "../utils/utils";

import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import {auth} from '../firebase';
import errorHandler from '../errors/index';


export default function Login({navigation}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with: ', user.email);
            })
            .catch(error => alert(errorHandler(error)))
    }

    return (
        <Container>
            <EmailInputField placeholder="Email" value={email} onChangeText={setEmail}/>
            <PasswordInputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry/>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.buttonBorder, styles.buttonOutline,]}>
                    <Text>
                        이메일 찾기{'  '}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonOutline, styles.buttonBorder]}
                                  onPress={() => navigation.push("PasswordReset")}>
                    <Text>
                        비밀번호 찾기 {'\t'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.push("Signup")}>
                    <Text>
                        회원가입
                    </Text>
                </TouchableOpacity>
            </View>
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

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 0,
        flexDirection: 'row',
        marginBottom: 20,
        alignSelf: 'flex-end',
        marginRight: 20,
    },
    buttonBorder: {
        borderRightWidth: 1,
    },
    buttonOutline: {
        marginHorizontal: 4
    },
})