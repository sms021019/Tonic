import React from "react";
import {Text, Image, StyleSheet} from "react-native";
import {flexCenter, TonicButtonWhite} from "../utils/styleComponents";
import styled from "styled-components/native";
import {ScreenType, windowWidth} from "../utils/utils";
import theme from "../utils/theme";
export default function Intro({navigation}) {
    const handleLogin = () => {
        navigation.push(ScreenType.LOGIN);
    };

    return (
        <Container>
            <Image source={require("../assets/AppStartLogo.png")} style={{width:windowWidth*0.6, height:windowWidth*0.6}} />
            <Text style={styles.head}>TONIC</Text>
            <Text style={styles.content}>Easy Buy, Easy Sell</Text>
            <Text style={styles.contentBottom}>SBU Market Place</Text>
            <StartButton onPress={handleLogin}>
                <StartText>Start</StartText>
            </StartButton>
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
        color: '#ffffff',
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
