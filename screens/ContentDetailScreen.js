// React
import React, {useLayoutEffect, useState, useContext, useEffect} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {Box, Flex, ScrollView} from "native-base";
import styled from "styled-components/native";
import {flexCenter, TonicButton} from "../utils/styleComponents";
// Context
import GlobalContext from '../context/Context';
// Utils
import {NavigatorType, ScreenType,} from "../utils/utils";
import theme from '../utils/theme';
// Component
import GoBackButton from "../components/GoBackButton";
import DeletePostModal from "../components/DeletePostModal";
import ReportPostModal from "../components/ReportPostModal";
// Model
import ImageSwiper from "../components/ImageSwiper";
import ReportUserModal from "../components/ReportUserModal";
import ConfirmMessageModal from "../components/ConfirmMessageModal";
import {showQuickMessage} from "../helpers/MessageHelper";
import ChatroomController from '../typeControllers/ChatroomController';
import {useRecoilValue} from "recoil";
import {postAtom} from "../recoil/postState";
import TimeHelper from "../helpers/TimeHelper";
import PostController from "../typeControllers/PostController";
import MenuButton from "../components/MenuButton";
import {thisUser, userAtomByEmail} from "../recoil/userState";
import UserController from "../typeControllers/UserController";
import ChatroomHeaderController from "../typeControllers/ChatroomHeaderController";



/*
This wrapper screen prevents showing an empty gray screen when the following screen is not ready.
 */
export default function ContentDetailScreenWrapper(props) {
    return (
        <Container>
            <ContentDetailScreen {...props}/>
        </Container>
    )
}

export function ContentDetailScreen({navigation, postId}) {
    const {postStateManager, userStateManager} = useContext(GlobalContext);
    const /**@type UserDoc*/ user = useRecoilValue(thisUser);
    const /**@type PostDoc*/ post = useRecoilValue(postAtom(postId))
    const /**@type UserDoc*/ postOwner = (user.email === post.ownerEmail)? user : useRecoilValue(userAtomByEmail(post?.ownerEmail));

    const [deleteModalOn, setDeleteModalOn] = useState(false);
    const [reportPostModalOn, setReportPostModalOn] = useState(false);
    const [reportUserModalOn, setReportUserModalOn] = useState(false);
    const [confirmMessageModal, setConfirmMessageModal] = useState({
        state: false,
        message: "",
    })

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
            headerLeft: () => <GoBackButton color={theme.colors.white} ml={15} callback={() => navigation.navigate(NavigatorType.HOME)} shadow={true}/>,
            headerRight: () => (
                <MenuButton mr={5} size={6} shadow={true}
                    items={
                        (user.email === post.ownerEmail) ?
                            [
                                {name: "Edit", color: theme.colors.primary, callback: handleEditPost},
                                {name: "Delete", color: theme.colors.alert, callback: OpenDeleteModal},
                            ] :
                            [
                                {name: "Report post", color: theme.colors.alert, callback: OpenReportPostModal},
                                {name: "Report user", color: theme.colors.alert, callback: OpenReportUserModal},
                            ]
                    }
                />
            )
        });
    }, [navigation]);

    useEffect(() => {
        handleAccessingDeletedPost();
    }, [])


    function handleAccessingDeletedPost() {
        PostController.isPostExist(postId).then(result => {
            if (result === false) {
                alert("This post is deleted.");
                postStateManager.refreshPostIds().then(() => {
                    navigation.navigate(ScreenType.CONTENT);
                });
            }
        })
    }

    async function asyncHandleChatClick() {
        if (user.email === post.ownerEmail) return;

        const /** @type ChatroomHeaderDoc */ chatroomHeader = await ChatroomHeaderController.asyncGetChatroomHeaderByEmailAndPostId(user.email, post.docId);

        if (chatroomHeader) {
            navigation.navigate(NavigatorType.CHAT, {chatroomId: chatroomHeader.chatroomId})
        }
        else {
            const docId = await asyncCreateNewChatAndGetDocId();
            if (!docId) {
                showQuickMessage("Fail to start chat. Please try again.");
                return false;
            }
            navigation.navigate(NavigatorType.CHAT, {chatroomId: docId})
        }
    }

    async function asyncCreateNewChatAndGetDocId() {
        let /** @type ChatroomDoc */ newChatroom = {
            docId: null,
            ownerEmail: postOwner.email,
            customerEmail: user.email,
            postId: post.docId,
        }

        if (await ChatroomController.asyncCreateNewChatroom(newChatroom) === false){
            return null;
        }
        return newChatroom.docId;
    }

    function handleEditPost() {
        navigation.navigate(NavigatorType.POST_EDIT, {postId: postId});
    }

    function OpenDeleteModal() { setDeleteModalOn(true); }
    function OpenReportPostModal() { setReportPostModalOn(true); }
    function OpenReportUserModal() { setReportUserModalOn(true); }

    async function handleDeletePost() {
        if (await PostController.asyncDelete(post) === false) {
            showQuickMessage("Fail to delete this post. Please try again.");
            return;
        }

        postStateManager.removeId(post.docId);
        userStateManager.refreshUser();
        showQuickMessage("The post is deleted successfully.");
        setDeleteModalOn(false);
        navigation.navigate(ScreenType.CONTENT);
    }

    async function asyncHandleReportPost() {
        if (await UserController.asyncReportPost(user.email, post.docId) === false) {
            showQuickMessage("Fail to report this post. Please try again.");
        }
        else {
            showQuickMessage("Successfully reported this post.");
            userStateManager.refreshUser();
        }
        setReportPostModalOn(false);
        navigation.navigate(ScreenType.CONTENT);
    }

    async function asyncHandleReportUser() {
        if (await UserController.asyncReportUser(user.email, post.ownerEmail) === false) {
            showQuickMessage("Fail to report this user. Please try again.");
        }
        else {
            showQuickMessage("Successfully reported this user.");
            userStateManager.refreshUser();
        }
        setReportUserModalOn(false);
        navigation.navigate(ScreenType.CONTENT);
    }

    function handleDismissConfirmMessageModal() {
        navigation.navigate(ScreenType.CONTENT);
    }

    return (
        <>
            <ConfirmMessageModal state={confirmMessageModal} setState={setConfirmMessageModal} handler={handleDismissConfirmMessageModal}/>
            <DeletePostModal state={deleteModalOn} setState={setDeleteModalOn} handleDeleteClick={handleDeletePost}/>
            <ReportPostModal state={reportPostModalOn} setState={setReportPostModalOn} handleReportPost={asyncHandleReportPost}/>
            <ReportUserModal state={reportUserModalOn} setState={setReportUserModalOn} handleReportUser={asyncHandleReportUser}/>
            <ScrollView>
                <ImageSwiper postImages={post.postImages} />
                <View style={styles.contentArea}>
                    <Box style={styles.titleBox}>
                        <Text style={styles.titleText}>{post.title}</Text>
                    </Box>
                    <Flex w="100%" h="30px" mb="50px" direction="row" alignItems="center">
                        <Text style={styles.userNameText}>{`@${postOwner?.username}`}</Text>
                        <Text style={{color:'gray'}}>{TimeHelper.getTopElapsedStringUntilNow(post.postTime)} ago</Text>
                    </Flex>
                    <Text style={styles.contentText}>{post.info}</Text>
                </View>
            </ScrollView>
            <View style={styles.footerArea}>
                <Flex direction="row" alignItems='center'>
                    <Text flex="1" style={styles.priceText}>
                        ${post.price.toLocaleString()}
                    </Text>
                    {
                        (user.email === post.ownerEmail)?
                        <ChatButton style={{marginRight:10}} onPress={handleEditPost}>
                            <TonicText>Edit</TonicText>
                        </ChatButton>
                            :
                        <ChatButton style={{marginRight:10}} onPress={asyncHandleChatClick}>
                            <TonicText>Chat</TonicText>
                        </ChatButton>
                    }
                </Flex>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    titleBox:               { height: 60, justifyContent: "center"},
    slide:                  { flex: 1, justifyContent: "center", backgroundColor: "transparent"},
    background:             { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,},
    dot:                    { backgroundColor: "rgba(255,255,255,.5)", width: 7, height: 7, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,},
    activeDot:              { backgroundColor: "#FFF", width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,},
    footerArea:             { alignSelf: 'center', height: 100, width: "100%", borderRadius: 4, padding: 10, shadowColor: 'black', shadowRadius: 8, shadowOpacity: 0.07, backgroundColor: 'white' },
    contentArea:            { display: 'flex', justifyContent:'center', width:"100%", padding:16, shadowOpacity:0.07, shadowRadius:10, shadowOffset: {width: 0, height: -15}, backgroundColor:'white' },
    priceText:              { fontSize: 24, fontWeight:'800', paddingLeft:10},
    titleText:              { fontSize: 24, fontWeight: '800'},
    userNameText:           { fontSize: 16, fontWeight: '600', marginRight:8, color:theme.colors.primary},
    contentText:            { fontSize: 20},
    bottomSheetPrimaryText: { fontSize: 22, fontWeight: '600', color:theme.colors.primary, margin:15},
    bottomSheetAlertText:   { fontSize: 22, fontWeight: '600', color:theme.colors.alert, margin:15},
});


const Container = styled.View`
  ${flexCenter};
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

const ChatButton = styled.Pressable`
    ${TonicButton};
    width: 70px;
    height: 50px;
    border-radius: 8px;
`;

const TonicText = styled.Text`
    color: ${theme.colors.white};
    font-size: 18px;
    font-weight: 600;
`;


