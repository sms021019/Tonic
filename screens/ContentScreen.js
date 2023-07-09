import React, {useCallback, useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Text, TouchableOpacity, View, Button} from 'react-native'
import {Center, FlatList, Input, Icon, Divider} from "native-base";
import styled from "styled-components/native";
// util
import {flexCenter, TonicButton} from "../utils/styleComponents";
import {DBCollectionType, NavigatorType, PageMode, windowHeight, windowWidth} from "../utils/utils";
// components
import Post from "../components/Post";
import HeaderLeftLogo from '../components/HeaderLeftLogo'
import SearchIcon from "../components/SearchIcon";

import {errorHandler} from '../errors';
import GlobalContext from '../context/Context';
// firebase
import {getDocs, collection} from 'firebase/firestore';
import {db} from "../firebase";
// model
import PostModel from "../models/PostModel";
import PostList from "../components/PostList";
import ErrorScreen from "./ErrorScreen";

const LoadingView = <View><Text>Loading...</Text></View>

export default function ContentScreen({navigation}) {
    const {user} = useContext(GlobalContext);
    const {events} = useContext(GlobalContext);
    const {postModelList} = useContext(GlobalContext);
    const [refreshing, setRefreshing] = useState(false);
    const [hasError, setHasError] = useState(false);


    let onContentChangeEvent = useCallback(() => {
        LoadAllPost();
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle:'',
            headerLeft: () => <HeaderLeftLogo/>,
            headerRight: () => <SearchIcon callback={() => {navigation.navigate(NavigatorType.SEARCH)}}/>,
        });
    }, [navigation]);

    useEffect(() => {
        events.addOnContentUpdate(onContentChangeEvent);
        LoadAllPost();
    }, []);

    if (hasError) {
        return <ErrorScreen/>;
    }

    // Add Event

/* ------------------
       Handlers
 -------------------*/
    function handleContentClick(docId) {
        if (docId === -1 || !docId) return;
        navigation.navigate(NavigatorType.CONTENT_DETAIL, {docId: docId})
    }

    function handleCreateButtonClick() {
        navigation.navigate(NavigatorType.POSTING, {mode: PageMode.CREATE});
    }

    function handleRefresh() {
        setRefreshing(true)
        LoadAllPost();
    }
    function LoadAllPost() {
        async function asyncLoadAllPost() {
            let _postModelList = [];
            if (await PostModel.loadAllData(/* OUT */ _postModelList) === false) {
                // ERROR HANDLE
                console.log("fail to load data");
                setHasError(true);
                return false;
            }

            postModelList.set(_postModelList);
            setRefreshing(false);
            return true;
        }

        asyncLoadAllPost().then();
    }

/* ------------------
      Components
 -------------------*/
    const ContentView = (
        <PostList
            modelList={postModelList}
            handleClick={handleContentClick}
            handleRefresh={handleRefresh}
            refreshing={refreshing}
        />
    )

/* ------------------
      Render
-------------------*/
    return (
        <Container>
            <ContentArea>
                {!user ? LoadingView : ContentView}
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
