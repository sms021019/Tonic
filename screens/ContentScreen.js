import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Text} from 'react-native'
import {Center, Flex} from "native-base";
import styled from "styled-components/native";
// util
import {NavigatorType, windowHeight, windowWidth} from "../utils/utils";
// components
import HeaderLeftLogo from '../components/HeaderLeftLogo'
import PostFlatList from "../components/PostFlatList";
import CreatePostButton from "../components/CreatePostButton";
import {useRecoilValue} from "recoil";
import {postIdsAtom} from "../recoil/postState";
import GlobalContext from "../context/Context";

export default function ContentScreen({navigation}) {
    const {postStateManager} = useContext(GlobalContext);
    const [refreshing, setRefreshing] = useState(false);
    const postIds = useRecoilValue(postIdsAtom);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle:'',
            headerLeft: () => <HeaderLeftLogo/>,
        });
    }, [navigation]);

    useEffect(() => {
        refreshPostIds().then();
    }, [refreshing])

    async function refreshPostIds() {
        await postStateManager.refreshPostIds();
        setRefreshing(false);
    }

    function handleContentClick(postId) {
        if (!postId) return;
        navigation.navigate(NavigatorType.CONTENT_DETAIL, {postId: postId})
    }

    function handleCreatePost() {
        navigation.navigate(NavigatorType.POST_CREATE);
    }

    function onRefreshTrigger() {
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
                        handleRefresh={onRefreshTrigger}
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
