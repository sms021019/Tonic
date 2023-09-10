import Channel from "../components/Channel";
import {SafeAreaView, StyleSheet} from "react-native";
import theme from "../utils/theme";
import {Divider} from "@rneui/base";
import React from "react";
import styled from "styled-components/native";


export default function ChannelScreen({navigation}) {
    return(
        <SafeAreaView style={styles.container}>
            <TopContainer>
                <UsernameText>Messages</UsernameText>
            </TopContainer>
            <Divider />
            <Channel navigation={navigation}/>
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
