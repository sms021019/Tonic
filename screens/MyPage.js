import React, {useContext, useLayoutEffect} from 'react'
import {View, Text, TouchableOpacity, Button} from 'react-native'
import styled from "styled-components/native";
import {Feather} from "@expo/vector-icons";
import {flexCenter} from "../utils/styleComponents";
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import errorHandler from '../errors';
import GlobalContext from '../context/Context';
import {NavigatorType, PageMode} from "../utils/utils";
import GoBackButton from "../components/GoBackButton";
import theme from "../utils/theme";
import {HamburgerIcon, Menu, Pressable} from "native-base";


export default function MyPage({navigation}) {
    const { user } = useContext(GlobalContext);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity onPress={() => navigation.navigate(NavigatorType.SETTING)}>
                    <Feather name={"settings"} size={24} marginRight={14} />
                </TouchableOpacity>
        });
    }, [navigation]);

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
            <Text>
                {`Email verified: ${user?.emailVerified ? 'true' : 'false'}`}
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