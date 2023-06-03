import React from 'react'
import {View, Text} from 'react-native'
import styled from "styled-components/native";
import {flexCenter} from "../utils/styleComponents";
import {GiftedChat} from 'react-native-gifted-chat';

export default function Chat() {

    return (
        <View><Text>This is onChangeText</Text></View>
    )
}

const Container = styled.View`
  ${flexCenter};
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;