import React from 'react'
import {View, Text} from 'react-native'
import styled from "styled-components/native";
import {flexCenter} from "../utils/styleComponents";

export default function EditProfileScreen() {
    return (
        <Container>
            <Text>
                This is EditProfile
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