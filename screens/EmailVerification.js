import {
    sendEmailVerification,
    signOut
} from 'firebase/auth';
import React, {useState, useContext, useLayoutEffect} from 'react'
import { Text } from 'react-native'
import { flexCenter, TonicButton} from "../utils/styleComponents";
import theme from '../utils/theme'
import styled from "styled-components/native";
import {windowWidth} from "../utils/utils";
import GoBackButton from "../components/GoBackButton";

import {auth} from '../firebase';
import GlobalContext from '../context/Context';



const EmailVerification = ({navigation}) => {
    const {user} = useContext(GlobalContext);
    const [emailSent, setEmailSent] = useState('none');

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: "",
            headerLeft: () => <GoBackButton
                color={theme.colors.lightGray}
                ml={10}
                callback={handleSignOut}
            />
        });
    }, [navigation]);

    const handleSignOut = () => {
        signOut(auth)
        .then(() => {
            console.log(`${user?.email} logged out`);
            navigation.navigate("Login");
        })
        .catch(error => console.log(error))
    }


    const handleVerify = async () => {
        sendEmailVerification(user)
            .then( userCredentials => {
                console.log('Email verification sent');
                setEmailSent('block');
            })
            .catch(error => console.log(error));
    }

    return (
        <Container>
            <PasswordResetText>{`Please verify your email\nEmail address: ${user?.email}`}</PasswordResetText>
            <StartButton onPress={handleVerify}>
                <StartText>VERIFY EMAIL</StartText>
            </StartButton>
            <ConfirmTextContainer style = {{display: emailSent}}>
                <ConfirmText>
                    The verification is sent to current email address.{"\n"}
                    Please follow the instruction.
                </ConfirmText>
                <StartButton onPress={handleSignOut}>
                    <StartText>FINISH VERIFY</StartText>
                </StartButton>
            </ConfirmTextContainer>
        </Container>
    )
}

export default EmailVerification;

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
    justify-content: center;
`;