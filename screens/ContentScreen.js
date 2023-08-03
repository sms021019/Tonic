import React, {useCallback, useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Text, TouchableOpacity, View, Button} from 'react-native'
import {Center, FlatList, Input, Icon, Divider} from "native-base";
import styled from "styled-components/native";
// util
import {flexCenter, TonicButton} from "../utils/styleComponents";
import {DBCollectionType, NavigatorType, PageMode, windowHeight, windowWidth} from "../utils/utils";
// components
import HeaderLeftLogo from '../components/HeaderLeftLogo'
import SearchIcon from "../components/SearchIcon";
import PostFlatList from "../components/PostFlatList";
import {errorHandler} from '../errors';
import GlobalContext from '../context/Context';
// firebase
import {getDocs, collection} from 'firebase/firestore';
import {db} from "../firebase";
// model
import PostModel from "../models/PostModel";
import ErrorScreen from "./ErrorScreen";
import CreatePostButton from "../components/CreatePostButton";

const LoadingView = <View><Text>Loading...</Text></View>

export default function ContentScreen({navigation}) {
    const {user, gUserModel, events, postModelList} = useContext(GlobalContext);
    const [refreshing, setRefreshing] = useState(false);
    const [hasError, setHasError] = useState(false);

    let onContentChangeEvent = useCallback(() => {
        asyncLoadAllPost().then();
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
        asyncLoadAllPost().then();
    }, []);

    useEffect(() => {
        asyncLoadAllPost().then();
    }, [gUserModel])

    if (hasError) {
        return <ErrorScreen/>;
    }

/* ------------------
       Handlers
 -------------------*/
    function handleContentClick(docId) {
        if (docId === -1 || !docId) return;
        navigation.navigate(NavigatorType.CONTENT_DETAIL, {docId: docId})
    }

    function handleCreatePost() {
        navigation.navigate(NavigatorType.POSTING, {mode: PageMode.CREATE});
    }

    function handleRefresh() {
        setRefreshing(true)
        asyncLoadAllPost().then();
    }
    async function asyncLoadAllPost() {
        let models = await PostModel.loadAllUnblocked(gUserModel.model.email)

        if (models === null) {
            console.log("fail to load data");
            setHasError(true);
        }

        postModelList.set(models);
        setRefreshing(false);
    }

/* ------------------
      Components
 -------------------*/
    const ContentView = (
        <PostFlatList
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
                {(!user || !postModelList) ? LoadingView : ContentView}
            </ContentArea>
            <CreateButtonArea>
                <CreatePostButton onPress={handleCreatePost}/>
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

const ContentArea = styled.View`
  display: flex;
  flex: 1;
  background-color: #fff;
`;

const CreateButtonArea = styled.View`
  position: absolute;
  top: ${windowHeight - 250}px;
  left: ${windowWidth - 80}px;
`
