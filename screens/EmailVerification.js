
import React, {useState, useLayoutEffect, useMemo, useEffect, useRef, useContext} from 'react'
import { flexCenter} from "../utils/styleComponents";
import theme from '../utils/theme'
import styled from "styled-components/native";
import {ScreenType, windowWidth} from "../utils/utils";
import GoBackButton from "../components/GoBackButton";
import {userAuthAtom} from "../recoil/userState";
import {useRecoilState, useSetRecoilState} from "recoil";
import {Image, StyleSheet, Text, TouchableOpacity} from "react-native";
import {Divider, Center, Flex} from 'native-base'
import AuthController from "../typeControllers/AuthController";
import {showQuickMessage} from "../helpers/MessageHelper";
import {accessAtom, AccessStatus} from "../recoil/accessState";
import GlobalContext from "../context/Context";


const EmailVerification = ({navigation}) => {
    const {userStateManager} = useContext(GlobalContext);
    const setAccessStatus= useSetRecoilState(accessAtom);
    const [userAuth, setUserAuth] = useRecoilState(userAuthAtom);
    const [emailSent, setEmailSent] = useState(false);
    const intervalRef = useRef();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: "",
            headerLeft: () => <GoBackButton
                color={theme.colors.lightGray}
                ml={10}
                callback={asyncHandleSignOut}
            />
        });
    }, [navigation]);

    useEffect(() => {
        if (emailSent) {
            intervalRef.current = setInterval(reloadUserAuth, 1000);
        }
        return () => {
            clearInterval(intervalRef.current);
        }
    }, [emailSent])


    async function reloadUserAuth() {
        await userAuth.reload();

        if (userAuth.emailVerified) {
            clearInterval(intervalRef.current);
            userStateManager.refreshUserAuth(userAuth);
            setAccessStatus(AccessStatus.VALID);
            showQuickMessage("Email has been verified!");
        }
    }

    const verifyButtonText = useMemo(() => {
        return emailSent? 'Send Again' : "Send Verification Email";
    }, [emailSent])

    const asyncHandleSignOut = async () => {
        if (await AuthController.asyncSignOut() === false) {
            console.log("Fail to sign out.");
            return;
        }
        navigation.navigate(ScreenType.LOGIN);
    }

    const asyncHandleVerify = async () => {
        if (await AuthController.asyncVerifyEmail(userAuth) === false){
            console.log("")
            return;
        }
        setEmailSent(true);
        showQuickMessage("Verification email has been sent to your email.");
    }

    return (
        <Container>
            <Flex style={styles.contentArea}>
                <Image source={require("../assets/emailIcon.jpg")} style={styles.emailIconArea} />
                <Text style={styles.titleText}>Verify your email address</Text>
                <Divider style={{marginTop: 20, marginBottom: 20}}/>
                <Text>In order to start using Tonic account, you need to confirm your email address.</Text>
                <TouchableOpacity disabled={emailSent} onPress={asyncHandleVerify}>
                    <Center style={{...styles.buttonArea}}>
                        <StartText>{verifyButtonText}</StartText>
                    </Center>
                </TouchableOpacity>
                {
                    emailSent &&
                    <>
                        <Text style={{color:theme.colors.primary}}>Verification email has been sent to your email.</Text>
                        <Text style={{color:theme.colors.primary}}>If you can't find it, please check the spam.</Text>
                    </>
                }
            </Flex>
        </Container>
    )
}

export default EmailVerification;

const styles = StyleSheet.create({
    contentArea: {justifyContent:'center', alignItems:'center', width: windowWidth*0.8, height: windowWidth*0.8},
    emailIconArea: {width:windowWidth*0.2, height:windowWidth*0.2, marginBottom:20},
    titleText: {fontWeight:'700', fontSize:18, color:"#4d4d4d"},
    buttonArea: {width: windowWidth*0.8, height: 40, borderRadius:8, marginTop: 20, marginBottom:20, backgroundColor: theme.colors.primary}
})

const PasswordResetText = styled.Text`
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
`;

const ConfirmTextContainer = styled.View`
    width: 60%;
    align-self: flex-start;
    margin-left: 20px;
`

const ConfirmText = styled.Text`
    margin-top: 40px;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;

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
    justify-content: center;
`;
