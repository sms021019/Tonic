import React, {useContext, useLayoutEffect, useState} from 'react'
import {StyleSheet, View, Text} from 'react-native';
import {Center, ScrollView} from "native-base";
import {windowHeight, windowWidth} from "../utils/utils";
import theme from "../utils/theme";
import PostList from "../components/PostList";
import UnblockPostModal from "../components/UnblockPostModal";
import {showQuickMessage} from "../helpers/MessageHelper";
import {thisUser} from "../recoil/userState";
import {useRecoilValue} from "recoil";
import UserController from "../typeControllers/UserController";
import GlobalContext from "../context/Context";

export default function ManageBlockedPostScreen({navigation}) {
    const {userStateManager} = useContext(GlobalContext);
    const /**@type {UserDoc}*/ user = useRecoilValue(thisUser);

    const [unblockModalOn, setUnblockModalOn] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Blocked posts',
        });
    }, [navigation]);

    async function asyncUnblockPost() {
        if (!selectedPostId || await UserController.asyncUnblockPost(user.email, selectedPostId) === false) {
            showQuickMessage("Fail to unblock this post. Please try again.");
        }
        else {
            showQuickMessage("Successfully unblock the post.");
            userStateManager.refreshUser();
        }
        setUnblockModalOn(false);
    }

    function handlePostClick(postId) {
        setSelectedPostId(postId);
        setUnblockModalOn(true);
    }

    return (
        <View style={styles.container}>
            <UnblockPostModal state={unblockModalOn} setState={setUnblockModalOn} handleUnblockPost={asyncUnblockPost}/>
            <ScrollView>
                <Center>
                    {
                        (user.reportedPostIds.length === 0) ?
                            <View style={{top: 300}}>
                                <Text style={{color:'gray'}}>No blocked post.</Text>
                            </View>
                        :
                        <PostList
                            postIds={user.reportedPostIds}
                            handleClick={handlePostClick}
                            filterBlockedPost={false}
                        />

                    }
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
