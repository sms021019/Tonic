import React, {useMemo, useState} from 'react'
import {StyleSheet, TouchableOpacity, Text} from "react-native";
import styled from "styled-components/native";
import {Box, Center} from "native-base";
import theme from '../utils/theme'
import {windowWidth} from "../utils/utils";
import {flexCenter} from "../utils/styleComponents";
import ErrorScreen from './ErrorScreen';
import AuthController from "../typeControllers/AuthController";
import {showQuickMessage} from "../helpers/MessageHelper";


export default function PasswordResetScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [hasError, setHasError] = useState(false);


    const sendButtonText = useMemo(() => {
        return (emailSent)? "Send Again" : "Send";
    }, [emailSent])

    async function handleResetPassword() {
        if (await AuthController.passwordReset(email) === false) {
            alert('Fail to reset password. Please try again later.');
        }
        else {
            setEmailSent(true);
            showQuickMessage("Password reset email has been sent to your email.")
        }
    }

    function navigateToLoginScreen() {
        navigation.pop();
    }

    if (hasError) return <ErrorScreen/>

    return (
        <Container>
            <Box style={{width:windowWidth*0.9, marginTop: 20}}>
                <PasswordResetText>You will receive instruction for resetting your password.</PasswordResetText>
            </Box>
            <EmailInputField placeholder="Your email address" value={email} onChangeText={setEmail} autoCapitalize="none"/>
            <Box marginTop={5}></Box>
            <TouchableOpacity onPress={handleResetPassword}>
                <Center style={styles.ButtonArea}>
                   <Text style={styles.buttonText}>{sendButtonText}</Text>
                </Center>
            </TouchableOpacity>
            <Box marginTop={3}></Box>
            {
                (emailSent) &&
                <TouchableOpacity onPress={navigateToLoginScreen}>
                    <Center style={styles.ButtonArea}>
                        <Text style={styles.buttonText}>Login</Text>
                    </Center>
                </TouchableOpacity>
            }
        </Container>
    )
}

const PasswordResetText = styled.Text`
    font-size: 14px;
    font-weight: 500;
`;

const EmailInputField = styled.TextInput`
    border-bottom-color: ${theme.colors.primary};
    border-bottom-width: 2px;
    width: ${windowWidth * 0.9}px;
    height: 50px;
    margin-bottom: 20px;
    margin-top: 20px;
`;

const Container = styled.View`
    ${flexCenter};
    background-color: #fff;
    align-items: center;
    justify-content: flex-start;
`;

const styles = StyleSheet.create({
    ButtonArea: {backgroundColor:theme.colors.primary, width: windowWidth*0.9, height: 56, borderRadius:8},
    buttonText: {fontWeight:'600', fontSize:18, color: '#ffffff'},
})


