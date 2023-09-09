
// React
import React, { useState } from 'react';
// Design
import { Divider } from '@rneui/base';
import { Center } from "../utils/styleComponents";
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from "styled-components/native";
// Util
import { NavigatorType } from '../utils/utils';
// recoil
import { useRecoilValue } from 'recoil';
import { chatroomHeaderIdsAtomByEmail } from '../recoil/chatroomHeaderState';
import {thisUser} from "../recoil/userState";
import ChatroomHeaderFlatList from '../components/ChatroomHeaderFlatList';
import {StyleSheet} from "react-native";
import theme from "../utils/theme";

export default function Channel({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const user = useRecoilValue(thisUser);
    const chatroomHeaderIds = useRecoilValue(chatroomHeaderIdsAtomByEmail(user.email));

    console.log(user.email);
    console.log("chatroomHeaderIds:", chatroomHeaderIds);

    function handleRefresh() {
        setRefreshing(true)
    }

    function handleContentClick(chatroomId) {
        if (!chatroomId) return;
        navigation.navigate(NavigatorType.CHAT, {chatroomId: chatroomId});
    }

/* ------------------
    Render
-------------------*/
    return (
        <SafeAreaView style={styles.container}>
            <TopContainer>
                <UsernameContainer>
                    <UsernameText>Messages</UsernameText>
                </UsernameContainer>
            </TopContainer>
            <Divider />
            <ContentArea>
                <ChatroomHeaderFlatList
                    chatroomHeaderIds={chatroomHeaderIds}
                    handleClick={handleContentClick}
                    handleRefresh={handleRefresh}
                    refreshing={refreshing}
                />
            </ContentArea>
        </SafeAreaView>
    );
};

const ContentArea = styled.View`
  display: flex;
  flex: 1;
  background-color: #fff;
`;
const TopContainer = styled.View`
    display: flex;
    flex-direction: row;
`;
const UsernameContainer = styled.View`
    ${Center};
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
