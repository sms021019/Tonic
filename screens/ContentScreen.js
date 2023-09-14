import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Box, Center, Flex} from "native-base";
import styled from "styled-components/native";
// util
import {NavigatorType, windowHeight, windowWidth} from "../utils/utils";
// components
import HeaderLeftLogo from '../components/HeaderLeftLogo'
import PostFlatList from "../components/PostFlatList";
import CreatePostButton from "../components/CreatePostButton";
import {useRecoilState, useRecoilValue} from "recoil";
import {postIdsAtom} from "../recoil/postState";
import GlobalContext from "../context/Context";
import ErrorBoundary from "react-native-error-boundary";
import theme from "../utils/theme";
import Global from "react-native-reanimated/src/reanimated2/js-reanimated/global";
import {showQuickMessage} from "../helpers/MessageHelper";
import {atomTest, globalFunctionTest} from "../recoil/userState";

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
            <ErrorBoundary FallbackComponent={ContentScreenErrorHandler}>
                <ContentArea>
                    {
                        (postIds?.length === 0)?
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
            </ErrorBoundary>
                <CreateButtonArea>
                    <CreatePostButton onPress={handleCreatePost}/>
                </CreateButtonArea>
        </Container>
    )
}

function ContentScreenErrorHandler({resetError}) {
    const {postStateManager} = useContext(GlobalContext);

    function handleReloadPostIds() {
        postStateManager.refreshPostIds();
        resetError();
    }

    return (
        <Center style={{width:'100%', height:'100%'}}>
            <Text style={styles.errorText}>Fail to load posts</Text>
            <Box marginTop={3}></Box>
            <TouchableOpacity onPress={handleReloadPostIds}>
               <Text style={styles.redirectText}>Reload</Text>
            </TouchableOpacity>
        </Center>
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

const styles = StyleSheet.create({
    errorText: {fontWeight:'400', fontSize:16, color:'gray', margin:2},
    redirectArea: {backgroundColor:theme.colors.primary, width: windowWidth*0.5, height: 40, borderRadius:50},
    redirectText: {fontWeight:'600', fontSize:16, color: theme.colors.primary},
})

