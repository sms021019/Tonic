import Channel from "../components/Channel";
import {SafeAreaView, StyleSheet, Text} from "react-native";
import theme from "../utils/theme";
import {Divider} from "@rneui/base";
import React, {Suspense} from "react";
import styled from "styled-components/native";
import LoadingScreen from "./LoadingScreen";

export default function ChannelScreen({navigation}) {
    return(
        <SafeAreaView style={styles.container}>
            <TopContainer>
                <UsernameText>Messages</UsernameText>
            </TopContainer>
            <Divider />
            <Suspense fallback={<LoadingScreen/>}>
                <Channel navigation={navigation}/>
            </Suspense>
        </SafeAreaView>
    )
}
const TopContainer = styled.View`
    display: flex;
    flex-direction: row;
`
const UsernameText = styled.Text`
    padding: 20px;
    font-size: 30px;
    font-weight: 700;
`
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: theme.colors.white,
    },
})
