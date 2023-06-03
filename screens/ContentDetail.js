import React from 'react'
import {View, Text} from 'react-native'
import styled from "styled-components/native";
import {flexCenter} from "../utils/styleComponents";

export default function ContentDetail() {
    return (
        <Container>
            <Text>
                This is ContentDetail
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