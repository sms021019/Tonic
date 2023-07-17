import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Box, Center, Divider, FlatList, Flex, ScrollView} from "native-base";
import {NavigatorType, windowWidth} from "../utils/utils";
import theme from "../utils/theme";
import PostList from "../components/PostList";
import GlobalContext from "../context/Context";
import PostModel from "../models/PostModel";
import LoadingAnimation from "../components/LoadingAnimation";
import LoadingScreen from "./LoadingScreen";

export default function ManageBlockedPostScreen({navigation}) {
    const {gUserModel} = useContext(GlobalContext);
    const [postModelList, setPostModelList] = useState(null);
    const [pageReady, setPageReady] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle:'Manage blocked posts',
        });
    }, [navigation]);

    useEffect(() => {
        asyncLoadPostReports().then();
    }, [])

    useEffect(() => {
        if (postModelList) {
            setPageReady(true);
        }
    }, [postModelList])

    if (pageReady === false) {
        return <LoadingScreen/>;
    }

    async function asyncLoadPostReports() {
        const refs = gUserModel.model.postReports;
        const models = await PostModel.loadAllByRefs(refs);
        setPostModelList(models);
    }

    function handleContentClick(docId) {

    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Center>
                    <PostList
                        modelList={postModelList}
                        handleClick={handleContentClick}
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
