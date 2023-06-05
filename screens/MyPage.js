import React, { useContext } from 'react'
import {View, Text} from 'react-native'
import styled from "styled-components/native";
import {flexCenter} from "../utils/styleComponents";
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import GlobalContext from '../context/Context';


export default function MyPage({navigation}) {
    const { user } = useContext(GlobalContext);

    const handleSignOut = () => {
        signOut(auth)
        .then(() => {
            console.log(`${user.email} logged out`)
        })
        .catch(error => alert(errorHandler(error)))
    }

    return (
        <Container>
            <Text>
                This is My Page
            </Text>
            <SignOutButton onPress={handleSignOut}>
                <SignOutText>Sign out</SignOutText>
            </SignOutButton>
        </Container>
    )
}

const Container = styled.View`
  ${flexCenter};
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

const SignOutButton = styled.TouchableOpacity`
    backgroundColor: #0782F9;
    width: 60%;
    padding: 15px;
    borderRadius: 10px;
    alignItems: center;
    marginTop: 40px;
`

const SignOutText = styled.Text`
    color: white;
    fontWeight: 700;
    fontSize: 16px;
`