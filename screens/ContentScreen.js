import React, {useCallback, useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Text, TouchableOpacity, View, Button} from 'react-native'
import {Center, FlatList, Input, Icon, Divider, Flex, Image, Box} from "native-base";
import styled from "styled-components/native";
// util
import {NavigatorType, windowHeight, windowWidth} from "../utils/utils";
// components
import HeaderLeftLogo from '../components/HeaderLeftLogo'
import PostFlatList from "../components/PostFlatList";
import {errorHandler} from '../errors';
import CreatePostButton from "../components/CreatePostButton";
import {useRecoilValue} from "recoil";
import {postIdsAtom} from "../recoil/postState";

export default function ContentScreen({navigation}) {
    const [refreshing, setRefreshing] = useState(false);
    const postIds = useRecoilValue(postIdsAtom);

    console.log("postIDs:", postIds);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle:'',
            headerLeft: () => <HeaderLeftLogo/>,
        });
    }, [navigation]);

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
