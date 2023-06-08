import React, {useContext, useLayoutEffect} from 'react'
import {Text, TouchableOpacity, View, Button} from 'react-native'
import {Center, FlatList, Input, Icon, Divider} from "native-base";
import styled from "styled-components/native";
import {Ionicons} from "@expo/vector-icons";

import {flexCenter, TonicButton} from "../utils/styleComponents";
import {NavigatorType, windowHeight, windowWidth} from "../utils/utils";

import Post from "../components/Post";
import HeaderLeftLogo from '../components/HeaderLeftLogo'
import SearchIcon from "../components/SearchIcon";

import {errorHandler} from '../errors';
import GlobalContext from '../context/Context';

export default function ContentScreen({navigation}) {
    const {user} = useContext(GlobalContext);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle:'',
            headerLeft: () => <HeaderLeftLogo/>,
            headerRight: () => <SearchIcon callback={() => {navigation.navigate(NavigatorType.SEARCH)}}/>,
        });
    }, [navigation]);
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
    const ContentView = (
        <Center flex={1} px="0">
            <FlatList
                data={postList}
                renderItem={(post) => {
                    return (
                        <View>
                            <View style={{margin: 20}}>
                                <Post onClickHandler={handleContentClick} key={post.id}/>
                            </View>
                            <Divider/>
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
        navigation.navigate(NavigatorType.CONTENT_DETAIL)
    }

    function handleCreateButtonClick() {
        navigation.navigate(NavigatorType.POSTING);
    }

/* ------------------
      Render
-------------------*/
    return (
        <Container>
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
  top: ${windowHeight - 250}px;
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
