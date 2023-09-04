import React, {useState} from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import {flexCenter, TonicButton} from "../utils/styleComponents";
import theme from '../utils/theme'
import styled from "styled-components/native";
import {ScreenType, windowWidth} from "../utils/utils";

import AuthController from "../typeControllers/AuthController";
import {Center} from "native-base";

export default function Login({navigation}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginFail, setLoginFail] = useState(false);

    async function asyncHandleLogin() {
        const result = await AuthController.asyncLogin(email, password);
        if (result.status === false) {
            if (result.errorCode === AuthController.ErrorCode.TOO_MANY_REQUEST) {
                alert("Too many login tries. Try again later.");
            }
            else {
                setLoginFail(true);
            }
        }
        else {
            console.log("Successfully LOGGED IN.");
        }
    }

    function handleFindPassword() {
        navigation.push(ScreenType.PASSWORD_RESET)
    }

    function handleCreateAccount() {
        navigation.push(ScreenType.SIGNUP)
    }

    function handleChangeEmail(value) {
        if (loginFail) setLoginFail(false)
        setEmail(value);
    }

    function handleChangePassword(value) {
        if (loginFail) setLoginFail(false)
        setPassword(value)
    }

    return (
        <Container>
            <EmailInputField placeholder="Email (.edu)" value={email} onChangeText={handleChangeEmail} autoCapitalize="none"/>
            <PasswordInputField placeholder="Password" value={password} onChangeText={handleChangePassword} secureTextEntry autoCapitalize="none"/>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={{...styles.buttonOutline, ...styles.buttonBorder}}
                                  onPress={handleFindPassword}>
                    <Text style={styles.optionText}>
                        Find Password {' '}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonOutline} onPress={handleCreateAccount}>
                    <Text style={styles.optionText}>
                        Create Account
                    </Text>
                </TouchableOpacity>
            </View>
            {
                (loginFail) &&
                <Center style={styles.loginFailMessageArea}>
                    <Text style={styles.loginFailText}>
                        Incorrect email or password
                    </Text>
                </Center>
            }
            <TouchableOpacity onPress={asyncHandleLogin}>
                <Center style={styles.ButtonArea}>
                    <Text style={styles.buttonText}>Login</Text>
                </Center>
            </TouchableOpacity>
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

const Container = styled.View`
    ${flexCenter};
    background-color: #fff;
    align-items: center;
    justify-content: flex-start;
`;

const styles = StyleSheet.create({
    buttonContainer: {flex: 0, flexDirection: 'row', marginBottom: 20, alignSelf: 'flex-end', marginRight: 20,},
    buttonBorder: {borderRightWidth: 1,},
    buttonOutline: {marginHorizontal: 4,},
    optionText: {color: theme.colors.primary,},
    loginFailMessageArea: {width: windowWidth*0.9, padding:5, marginBottom: 10, backgroundColor:'#ffbdbd'},
    loginFailText: {color:"#8a2020"},
    ButtonArea: {backgroundColor:theme.colors.primary, width: windowWidth*0.9, height: 56, borderRadius:8},
    buttonText: {fontWeight:'600', fontSize:18, color: '#ffffff'},
})
