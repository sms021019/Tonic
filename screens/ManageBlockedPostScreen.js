import React, {useCallback, useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Box, Center, Divider, FlatList, Flex, ScrollView} from "native-base";
import {NavigatorType, windowWidth} from "../utils/utils";
import theme from "../utils/theme";
import PostList from "../components/PostList";
import GlobalContext from "../context/Context";
import PostModel from "../models/PostModel";
import LoadingScreen from "./LoadingScreen";
import UnblockPostModal from "../components/UnblockPostModal";

export default function ManageBlockedPostScreen({navigation}) {
    const {gUserModel, events} = useContext(GlobalContext);
    const [blockedPostModelList, setBlockedPostModelList] = useState(null);
    const [pageReady, setPageReady] = useState(false);
    const [unblockModalOn, setUnblockModalOn] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Blocked posts',
        });
    }, [navigation]);

    useEffect(() => {
        asyncLoadBlockedPosts().then();
    }, [gUserModel])

    useEffect(() => {
        if (blockedPostModelList) {
            setPageReady(true);
        }
    }, [blockedPostModelList])


    if (pageReady === false) {
        return <LoadingScreen/>;
    }

    async function asyncLoadBlockedPosts() {
        const refs = gUserModel.model.postReports;
        const models = await PostModel.loadAllByRefs(refs);
        setBlockedPostModelList(models);
    }

    async function asyncUnblockPost() {
        const postModel = blockedPostModelList.find(model => model.doc_id === selectedPostId);
        await gUserModel.unblockPost(postModel);

        events.invokeOnContentUpdate();
        setUnblockModalOn(false);
        alert("The post is unblocked now.")
    }

    function handlePostClick(docId) {
        setSelectedPostId(docId);
        setUnblockModalOn(true);
    }

    return (
        <View style={styles.container}>
            <UnblockPostModal state={unblockModalOn} setState={setUnblockModalOn} handleUnblockPost={asyncUnblockPost}/>
            <ScrollView>
                <Center>
                    <PostList
                        modelList={blockedPostModelList}
                        handleClick={handlePostClick}
                    />
                </Center>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    menu: {width: windowWidth, height: 60, justifyContent:'center', paddingLeft: 20, paddingRight: 20},
    menuText: {flex:1, fontWeight: "600", fontSize:16, color: theme.colors.text},
    menuTextGray: {flex:1, textAlign:'right', fontWeight: "600", fontSize:16, color: theme.colors.iconGray},
    menuTextRed: {flex:1, textAlign:'right', fontWeight: "600", fontSize:16, color: theme.colors.alert},
    bold: {fontWeight: "600"},
    grayText: {color: 'gray'},
});
