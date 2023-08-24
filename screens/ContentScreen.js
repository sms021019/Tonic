import React, {useCallback, useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Text, TouchableOpacity, View, Button} from 'react-native'
import {Center, FlatList, Input, Icon, Divider, Flex, Image, Box} from "native-base";
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

import ErrorScreen from "./ErrorScreen";
import CreatePostButton from "../components/CreatePostButton";
import {useRecoilValue} from "recoil";
import {postIdsAtom} from "../recoli/postState";
import LoadingScreen from '../screens/LoadingScreen'
import theme from "../utils/theme";

export default function ContentScreen({navigation}) {
    const {user} = useContext(GlobalContext);
    const [refreshing, setRefreshing] = useState(false);
    const [hasError, setHasError] = useState(false);

    const postIds = useRecoilValue(postIdsAtom);

    console.log("postIDs:", postIds);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle:'',
            headerLeft: () => <HeaderLeftLogo/>,
        });
    }, [navigation]);

    if (hasError) {
        return <ErrorScreen/>;
    }

    if (!user) {
        return <LoadingScreen/>
    }

/* ------------------
       Handlers
 -------------------*/
    function handleContentClick(postId) {
        if (!postId) return;
        navigation.navigate(NavigatorType.CONTENT_DETAIL, {postId: postId})
    }

    function handleCreatePost() {
        navigation.navigate(NavigatorType.POST_CREATE);
    }

    function handleRefresh() {
        setRefreshing(true)
    }
/* ------------------
      Render
-------------------*/
    return (
        <Container>
            <ContentArea>
                {
                    (postIds.length === 0)?
                        <Flex h={"100px"} w={windowWidth} justifyContent={'center'}>
                            <Center>
                                <Text style={{color: 'gray'}}>No post</Text>
                            </Center>
                        </Flex>
                    :
                    <PostFlatList
                        postIds={postIds}
                        handleClick={handleContentClick}
                        handleRefresh={handleRefresh}
                        refreshing={refreshing}
                    />
                }
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
