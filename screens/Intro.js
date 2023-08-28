import React, {useContext, useEffect} from "react";
import {Text, View, Image, Pressable, StyleSheet, TouchableOpacity} from "react-native";
import {flexCenter, TonicButton, TonicButtonWhite} from "../utils/styleComponents";
import styled from "styled-components/native";
import {NavigatorType, ScreenType, windowWidth} from "../utils/utils";
import theme from "../utils/theme";
import {useRecoilValue} from "recoil";
import {userAtom, userAuthAtom} from "../recoil/userState";
import GlobalContext from "../context/Context";

export default function Intro({navigation}) {
    const {userStateManager} = useContext(GlobalContext);
    const userAuth = useRecoilValue(userAuthAtom);
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        if (userAuth && userAuth?.emailVerified) {
            console.log("go to home");
            navigation.navigate(NavigatorType.HOME);
        }
    }, [userAuth, user])

    const goLogin = () => {
        navigation.push(ScreenType.LOGIN);
    };

    return (
        <Container>
            <Image source={require("../assets/AppStartLogo.png")} style={{width:windowWidth*0.6, height:windowWidth*0.6}} />
            <Text style={styles.head}>TONIC</Text>
            <Text style={styles.content}>알뜰 살뜰 스토니 중고거래</Text>
            <Text style={styles.contentBottom}>얼른 시작해보세요!</Text>
            <StartButton onPress={goLogin}>
                <StartText>시작하기</StartText>
            </StartButton>
            <TouchableOpacity>
                <Text style={styles.tip}>이미 계정이 있나요? 로그인</Text>
            </TouchableOpacity>
        </Container>
    );
}

const styles = StyleSheet.create({
    head: {
        fontSize: 24,
        fontWeight: "800",
        color: 'white',
    },
    content: {
        fontSize: 18,
        paddingTop: 4,
        paddingBottom: 4,
        color: 'white',
    },
    contentBottom: {
        fontSize: 18,
        marginBottom: 32,
        color: 'white',
    },
    tip: {
        fontSize: 12,
        marginTop: 10,
        color: theme.colors.foreground,
    }
});
const Container = styled.View`
    ${flexCenter};
    background-color: ${theme.colors.primary};
    align-items: center;
    justify-content: center;
`;

const StartButton = styled.Pressable`
    ${TonicButtonWhite};
    width: ${windowWidth * 0.9}px;
    height: 56px;
    border-radius: 8px;
`;


const StartText = styled.Text`
    color: ${theme.colors.primary};
    font-size: 18px;
    font-weight: 600;
`;
