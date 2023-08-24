
import React, {useState, useContext, useLayoutEffect} from 'react'
import { flexCenter, TonicButton} from "../utils/styleComponents";
import theme from '../utils/theme'
import styled from "styled-components/native";
import {ScreenType, windowWidth} from "../utils/utils";
import GoBackButton from "../components/GoBackButton";
import GlobalContext from '../context/Context';
import UserModel from '../models/UserModel';


const EmailVerification = ({navigation}) => {
    const {user} = useContext(GlobalContext);
    const [emailSent, setEmailSent] = useState('none');
    const [hasError, setHasError] = useState(false);

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

    const asyncHandleSignOut = async () => {
        if( await UserModel.asyncSignOut() === false){
            setHasError(true);
            return;
        }
        console.log(`${user?.email} logged out`);
        navigation.navigate(ScreenType.LOGIN);
    }


    const asyncHandleVerify = async () => {
        if(await UserModel.asyncEmailVerify(user) === false){
            setHasError(true);
            return;
        }
        console.log('Email verification sent');
        setEmailSent('block');
    }

    return (
        <Container>
            <PasswordResetText>{`Please verify your email\nEmail address: ${user?.email}`}</PasswordResetText>
            <StartButton onPress={asyncHandleVerify}>
                <StartText>VERIFY EMAIL</StartText>
            </StartButton>
            <ConfirmTextContainer style = {{display: emailSent}}>
                <ConfirmText>
                    The verification is sent to current email address.{"\n"}
                    Please follow the instruction.
                </ConfirmText>
                <StartButton onPress={asyncHandleSignOut}>
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
