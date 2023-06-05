import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React, {useEffect, useState, useContext} from 'react'
import {signOut} from 'firebase/auth'
import {useNavigation} from '@react-navigation/native';
import {errorHandler} from '../errors';
import {auth, db} from '../firebase';
import {getDocs, collection} from "firebase/firestore";
import styled from "styled-components/native";
import {flexCenter, TonicButton} from "../utils/styleComponents";
import {NavigatorType, windowHeight, windowWidth} from "../utils/utils";
import Post from "../components/Post";
import {Center, FlatList, Input, Icon, Divider, Button} from "native-base";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import { getUsername } from '../firestore';

import GlobalContext from '../context/Context';



export default function ContentScreen(props) {
    const { user } = useContext(GlobalContext);
    const navigation = useNavigation()
    // const [currUser, setCurrUser] = useState(null);

    // useEffect(() => {
    //     // setCurrUser(auth.currentUser.displayName);
    //     setCurrUser(user);
    // }, [])


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

    const LoadingView = <View><Text>Loading...</Text></View>

    const postList = [
        {id: 1},
        {id: 2},
        {id: 3},
        {id: 4},
        {id: 5},
        {id: 6},
        {id: 7},
        {id: 8},
        {id: 9},
        {id: 10},
        {id: 11},
        {id: 12},
        {id: 13},
        {id: 14},
        {id: 15},
    ]

/* ------------------
      Components
 -------------------*/
    const SearchBar = (<Input placeholder="Search" variant="filled" width="90%" borderRadius="50" py="3" px="2" InputLeftElement={<Icon ml="2" size="5" color="gray.400" as={<Ionicons name="ios-search"/>}/>}/>)

    const ContentView = (
        <Center flex={1} px="0">
            <FlatList
                data={postList}
                renderItem={(post) => {
                    return (
                        <View style={{padding: 10}}>
                            <Post onClickHandler={handleContentClick} key={post.id}/>
                        </View>
                    );
                }}
                alwaysBounceVertical={false}
            />
        </Center>
    )

    const MainView = !user ? LoadingView : ContentView

/* ------------------
       Handlers
 -------------------*/
    // function handleSignOut() {
    //     signOut(auth)
    //         .then(() => {
    //             navigation.replace("LoginNavigator")
    //             console.log(`${username} logged out`)
    //         })
    //         .catch(error => alert(errorHandler(error)))
    // }
    function handleContentClick() {
        props.navigation.navigate(NavigatorType.CONTENT_DETAIL)
    }

    function handleCreateButtonClick() {
        props.navigation.navigate(NavigatorType.POSTING);
    }

/* ------------------
      Render
-------------------*/
    return (
        <Container>
            <SafeAreaView>
                <Center>
                    {SearchBar}
                </Center>
                <Divider style={{marginTop: 20}}/>
            </SafeAreaView>
            <ContentArea>
                {MainView}
            </ContentArea>
            <CreateButtonArea>
                <TouchableOpacity
                    onPress={handleCreateButtonClick}
                >
                    <CreateButton>
                        <BasicText>+</BasicText>
                    </CreateButton>
                </TouchableOpacity>
            </CreateButtonArea>
        </Container>
    )
}

/* ------------------
       Styles
 -------------------*/
const Container = styled.View`
  display: flex;
  flex: 1;
  background-color: #fff;
`;

const CreateButtonArea = styled.View`
  position: absolute;
  top: ${windowHeight - 150}px;
  left: ${windowWidth - 80}px;
`
const CreateButton = styled.View`
  ${TonicButton};
  border-radius: 100px;
  width: 60px;
  height: 60px;
`;

const ContentArea = styled.View`
  display: flex;
  flex: 1;
  background-color: #fff;
`;

const BasicText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;
