import React from 'react'
import {Text} from 'react-native'
import styled from "styled-components/native";
import {flexCenter} from "../utils/styleComponents";

export default function SettingScreen({navigation}) {

    return (
        <Container>
            <Text>
                This is Setting Page
            </Text>
        </Container>
    )
}

const Container = styled.View`
    ${flexCenter};
    background-color: #fff;
    align-items: center;
    justify-content: center;
`;
