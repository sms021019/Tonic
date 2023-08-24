// React
import React, {useLayoutEffect, useState, useContext, useEffect} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {Box, Flex, ScrollView} from "native-base";
import styled from "styled-components/native";
import {flexCenter, TonicButton} from "../utils/styleComponents";
// DB
import { db } from '../firebase';
import { doc, getDoc, collection } from 'firebase/firestore';
// Context
import GlobalContext from '../context/Context';
// Utils
import {DBCollectionType, NavigatorType, ScreenType} from "../utils/utils";
import theme from '../utils/theme';
// Component
import GoBackButton from "../components/GoBackButton";
import DeletePostModal from "../components/DeletePostModal";
import ReportPostModal from "../components/ReportPostModal";
// Model
import ChatroomModel from '../models/ChatroomModel';
import ImageSwiper from "../components/ImageSwiper";
import ReportUserModal from "../components/ReportUserModal";
import ConfirmMessageModal from "../components/ConfirmMessageModal";
import {showQuickMessage} from "../helpers/MessageHelper";
import {useRecoilValue} from "recoil";
import {postAtom} from "../recoli/postState";
import TimeHelper from "../helpers/TimeHelper";
import PostController from "../typeControllers/PostController";
import MenuButton from "../components/MenuButton";


export default function ContentDetailScreen({navigation, postId}) {
    const {user, chatroomModelList} = useContext(GlobalContext);
    const /**@type Post*/ post = useRecoilValue(postAtom(postId))

    const [owner, setPostOwner] = useState(null);

    const [deleteModalOn, setDeleteModalOn] = useState(false);
    const [reportPostModalOn, setReportPostModalOn] = useState(false);
    const [reportUserModalOn, setReportUserModalOn] = useState(false);
    const [confirmMessageModal, setConfirmMessageModal] = useState({
        state: false,
        message: "",
    })

    useEffect(() => {
        let userRef = doc(collection(db, DBCollectionType.USERS), post.ownerEmail);

        getDoc(userRef).then((doc) => {
            if(doc.data() === null) {
                // To Do : error handling.
                console.log(" err no post user");
                return;
            }

            setPostOwner(doc.data());
        })
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
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

    async function handleChatClick() {
        if (user.email === post.ownerEmail) return;

        const chatroomModel = ChatroomModel.newEmpty();
        if(await chatroomModel.asyncSetNewChatroomData(owner?.username, postId, owner, user) === false) return;

        chatroomModelList.addOne(chatroomModel);

        if( await chatroomModel.asyncSaveData() === false) {
            console.log("Failed to create chatroom")
            return false;
        }

        navigation.navigate(NavigatorType.CHAT, {screen: ScreenType.CHAT, params: {doc_id: chatroomModel.doc_id}});

        return true;
    }

    function handleEditPost() {
        // navigation.navigate(NavigatorType.POSTING, {mode: PageMode.EDIT, docId: docId});
    }

    function OpenDeleteModal() {
        setDeleteModalOn(true);
    }

    function OpenReportPostModal() {
        setReportPostModalOn(true);
    }

    function OpenReportUserModal() {
        setReportUserModalOn(true);
    }

    async function handleDeletePost() {
        if (await PostController.asyncDelete(post) === false) {
            // show msg :: something went wrong. try again
            return;
        }

        setDeleteModalOn(false);
        showQuickMessage("The post is deleted successfully.");
        navigation.navigate(ScreenType.CONTENT);
    }

    async function asyncHandleReportPost() {
        // await gUserModel.reportPost(postModel);
        //
        // events.invokeOnContentUpdate();
        //
        // setReportPostModalOn(false);
        //
        // showQuickMessage("The post is reported and blocked successfully. You can unblock it in the setting.");
        //
        // navigation.navigate(ScreenType.CONTENT);
    }

    async function asyncHandleReportUser() {
        // await gUserModel.reportUser(postModel.email);
        //
        // events.invokeOnContentUpdate();
        //
        // setReportUserModalOn(false);
        //
        // showQuickMessage("The user is reported and blocked successfully. You can unblock it in the setting.");
        //
        // navigation.navigate(ScreenType.CONTENT);
    }

    function handleDismissConfirmMessageModal() {
        navigation.navigate(ScreenType.CONTENT);
    }

    return (
        <Container>
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
                        <Text style={styles.userNameText}>{`@${owner?.username}`}</Text>
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
                    <ChatButton style={{marginRight:10}} onPress={handleChatClick}>
                        <TonicText>Chat</TonicText>
                    </ChatButton>
                </Flex>
            </View>
        </Container>
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
