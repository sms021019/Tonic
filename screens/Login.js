import React, {useState, useEffect} from 'react'
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native'
import {flexCenter, TonicButton} from "../utils/styleComponents";
import theme from '../utils/theme'
import styled from "styled-components/native";
import {NavigatorType, ScreenType, windowWidth} from "../utils/utils";

import AuthController from "../typeControllers/AuthController";
import {Center, Flex} from "native-base";
import {useRecoilValue} from "recoil";
import {userAuthAtom} from "../recoli/userState";

export default function Login({navigation}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginFail, setLoginFail] = useState(false);
    const userAuth = useRecoilValue(userAuthAtom);

    useEffect(() => {
        if (!userAuth) return;

        if (userAuth.emailVerified === false) {
            navigation.navigate(ScreenType.EMAIL_VERIFICATION);
        }
        else {
            navigation.navigate(NavigatorType.HOME);
        }
    }, [userAuth])

    async function asyncHandleLogin() {
        if (await AuthController.asyncLogin(email, password) === false){
            setLoginFail(true);
        }
    }

    return (
        <Container>
            <EmailInputField placeholder="Email" value={email} onChangeText={setEmail}/>
            <PasswordInputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry/>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={{...styles.buttonOutline, ...styles.buttonBorder}}
                                  onPress={() => navigation.push(ScreenType.PASSWORD_RESET)}>
                    <Text style={styles.optionText}>
                        Find Password {' '}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.push(ScreenType.SIGNUP)}>
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
            <StartButton onPress={asyncHandleLogin}>
                <StartText>Login</StartText>
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
        marginHorizontal: 4,
    },
    optionText: {
        color: theme.colors.primary,
    },
    loginFailMessageArea: {width: windowWidth*0.9, padding:5, marginBottom: 10, backgroundColor:'#ffbdbd'},
    loginFailText: {color:"#8a2020"},

})
