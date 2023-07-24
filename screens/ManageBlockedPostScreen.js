import React, {useCallback, useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Box, Center, Divider, FlatList, Flex, ScrollView} from "native-base";
import {NavigatorType, windowWidth} from "../utils/utils";
import theme from "../utils/theme";
import PostList from "../components/PostList";
import GlobalContext from "../context/Context";
import PostModel from "../models/PostModel";
import LoadingScreen from "./LoadingScreen";
import UnblockPostModel from "../components/UnblockPostModal";

export default function ManageBlockedPostScreen({navigation}) {
    const {gUserModel, events} = useContext(GlobalContext);
    const [blockedPostModelList, setBlockedPostModelList] = useState(null);
    const [pageReady, setPageReady] = useState(false);
    const [blockModelOn, setBlockModalOn] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    let onNewPostReportedEvent = useCallback(() => {
        console.log("On new post block");
        asyncLoadPostReports().then();
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Blocked posts',
        });
    }, [navigation]);

    useEffect(() => {
        events.addOnPostReport(onNewPostReportedEvent);
        asyncLoadPostReports().then();
    }, [])

    useEffect(() => {
        if (blockedPostModelList) {
            setPageReady(true);
        }
    }, [blockedPostModelList])

    useEffect(() => {
        if (!selectedPostId) return;

        setBlockModalOn(true);
    }, [selectedPostId])


    if (pageReady === false) {
        return <LoadingScreen/>;
    }


    async function asyncLoadPostReports() {
        const refs = gUserModel.model.postReports;
        const models = await PostModel.loadAllByRefs(refs);
        setBlockedPostModelList(models);
    }

    async function asyncUnblockPost(docId) {
        const post = blockedPostModelList.find(post => post.doc_id === docId);
        await post.asyncUnblockPost(gUserModel.model.email);
        setBlockModalOn(false);

    }

    function handlePostClick(docId) {
        setSelectedPostId(docId);
    }

    return (
        <View style={styles.container}>
            <UnblockPostModel state={blockModelOn} setState={setBlockModalOn} handleDeleteClick={asyncUnblockPost}/>
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
