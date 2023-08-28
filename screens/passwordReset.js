import React, {useState, useEffect} from 'react'
import {flexCenter, TonicButton} from "../utils/styleComponents";
import theme from '../utils/theme'
import styled from "styled-components/native";
import {windowWidth} from "../utils/utils";
import ErrorScreen from './ErrorScreen';
import UserModel from '../models/UserModel';




export default PasswordResetScreen = () => {
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState('none');
    const [hasError, setHasError] = useState(false);

    const handleReset = () => {
        if( UserModel.passwordReset(email) === false ){
            // TO DO
            setHasError(true);
            return;
        }
        setEmail('');
        setEmailSent('block');

    }

    /* ------------------
        Error Screen
    -------------------*/
    if (hasError) return <ErrorScreen/>

    return (
        <Container>
            <PasswordResetText>Enter your email.</PasswordResetText>
            <EmailInputField placeholder="Email" value={email} onChangeText={setEmail}/>
            <StartButton onPress={handleReset}>
                <StartText>SEND</StartText>
            </StartButton>
            <ConfirmTextContainer style = {{display: emailSent}}>
                <ConfirmText>확인된 이메일로 비밀번호 재설정{"\n"}이메일이 전송되었습니다.{"\n"}이메일을 확인해주세요.</ConfirmText>
            </ConfirmTextContainer>
        </Container>
    )
}
const ConfirmTextContainer = styled.View`
    width: 60%;
    flex: 1;
    align-self: flex-start;
    margin-left: 20px;
`

const ConfirmText = styled.Text`
    margin-top: 40px;
    font-size: 18px;
    font-weight: 600;
`;

const PasswordResetText = styled.Text`
    margin-top: 40px;
    font-size: 18px;
    font-weight: 600;
`;

const EmailInputField = styled.TextInput`
    border-bottom-color: ${theme.colors.primary};
    border-bottom-width: 2px;
    width: ${windowWidth * 0.9}px;
    height: 50px;
    margin-bottom: 20px;
    margin-top: 20px;
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
    justify-content: flex-start;
`;

