import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import {signOut} from 'firebase/auth'
import {useNavigation} from '@react-navigation/native';
import {errorHandler} from '../errors';
import {auth, db} from '../firebase';
import {getDocs, collection} from "firebase/firestore";
import styled from "styled-components/native";
import {flexCenter, TonicButton} from "../utils/styleComponents";
import {windowWidth} from "../utils/utils";
// import { getUsername } from '../firestore';

export default function ContentScreen(props) {
    const navigation = useNavigation()
    const [currUser, setCurrUser] = useState(null);

    useEffect(() => {
        setCurrUser(auth.currentUser.displayName);
    }, [])


    // const getUsername = async () => {
    //     console.log("finding username...");
    //     const userCollection = collection(db, 'users');
    //     const userSnap = await getDocs(userCollection);
    //     userSnap.forEach(doc => {
    //         if(doc.data().uid === auth.currentUser.uid) {
    //             setUsername(doc.data().username);
    //             console.log("set username..")
    //         }
    //     });
    // }
    // getUsername();


    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                navigation.replace("LoginNavigator")
                console.log(`${username} logged out`)
            })
            .catch(error => alert(errorHandler(error)))
    }

    const LoadingView = <View><Text>Loading...</Text></View>

    const ContentView = (
        <View>
            <Text>Hello {currUser}</Text>
        </View>
    )

    let MainView = !currUser ? LoadingView : ContentView

    function handleContentClick() {
        props.navigation.navigate("ContentDetailNavigator")
    }
    return (
        <Container>
            {MainView}
            <TouchableOpacity onPress={handleContentClick}>
                <Text>Content</Text>
            </TouchableOpacity>
        </Container>
    )
}

const StartButton = styled.Pressable`
  ${TonicButton};
  width: ${windowWidth * 0.9}px;
  height: 56px;
  border-radius: 8px;
`;

const Container = styled.View`
  ${flexCenter};
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

const StartText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;
