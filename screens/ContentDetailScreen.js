// React
import React, {useLayoutEffect, useState, useContext, useEffect} from 'react'
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import {Box, Flex, ScrollView} from "native-base";
import styled from "styled-components/native";
import Swiper from "react-native-swiper";
import {flexCenter, TonicButton} from "../utils/styleComponents";
import {LinearGradient} from "expo-linear-gradient";
// DB
import { db } from '../firebase';
import { doc, getDoc, collection } from 'firebase/firestore';
// Context
import GlobalContext from '../context/Context';
// Utils
import {DBCollectionType, NavigatorType, PageMode, ScreenType, windowWidth} from "../utils/utils";
import theme from '../utils/theme';
// Component
import GoBackButton from "../components/GoBackButton";
import MenuButton from '../components/MenuButton'
import DeletePostModal from "../components/DeletePostModal";
import ReportPostModal from "../components/ReportPostModal";
// Model
import ChatroomModel from '../models/ChatroomModel';
import ImageSwiper from "../components/ImageSwiper";


export default function ContentDetailScreen({navigation, docId}) {
    const {events} = useContext(GlobalContext);
    const {postModelList} = useContext(GlobalContext);
    const { user } = useContext(GlobalContext);

    const [postModel, setPostModel] = useState(null);
    const [owner, setPostOwner] = useState(null);
    const [deleteModalOn, setDeleteModalOn] = useState(false);
    const [reportModalOn, setReportModalOn] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setPostModel(() => postModelList.getOneByDocId(docId));
    },[])

    useEffect(() => {
        if (postModel === null) return;

        let userRef = doc(collection(db, DBCollectionType.USERS), postModel.email);

        getDoc(userRef).then((doc) => {
            if(doc.data() === null) {
                // To Do : error handling.
                console.log(" err no post user");
                return;
            }

            setPostOwner(doc.data());
        })
    }, [postModel])

    useLayoutEffect(() => {
        if (postModel === null) return;

        navigation.setOptions({
            headerTransparent: true,
            headerTitle: "",
            headerLeft: () => <GoBackButton color={theme.colors.white} ml={15} callback={() => navigation.navigate(NavigatorType.HOME)}/>,
            headerRight: () => (
                <MenuButton mr={5} size={6}
                    items={
                        isMyPost() ?
                            [
                                {name: "Edit", color: theme.colors.primary, callback: handleEditPost},
                                {name: "Delete", color: theme.colors.alert, callback: OpenDeleteModal},
                            ] :
                            [
                                {name: "Report", color: theme.colors.alert, callback: OpenReportModal},
                            ]
                    }
                />
            )
        });
    }, [navigation, postModel]);

    if (postModel === null) {
        return (
            <Text>Loading..</Text>
        )
    }

    function isMyPost() {
        return user.email === postModel.email;
    }

    async function handleChatClick() {
        const chatroomModel = new ChatroomModel(doc(collection(db, DBCollectionType.USERS), postModel.email), user);
        await chatroomModel.saveData().then( ref => {
            if(ref){
                chatroomModel.setRef(ref);
                navigation.navigate(NavigatorType.CHAT, { screen: ScreenType.CHAT, params: {ref: ref}, });
            }
            else{
                // TO DO: error handle
                return;
            }
        })
    }

    function handleEditPost() {
        navigation.navigate(NavigatorType.POSTING, {mode: PageMode.EDIT, docId: docId});
    }

    function OpenDeleteModal() {
        setDeleteModalOn(true);
    }

    function OpenReportModal() {
        setReportModalOn(true);
    }
    async function handleDeletePost() {
        if (await postModel.deleteData() === false) {
            console.log("Fail to delete data.");
            return;
        }

        setDeleteModalOn(false);
        events.invokeOnContentUpdate();
        alert("Successfully delete the post.");
        navigation.navigate(ScreenType.CONTENT);
    }

    function handleReportPost() {
        setReportModalOn(false);
        alert("Successfully report the post.");
    }

    return (
        <Container>
            <DeletePostModal state={deleteModalOn} setState={setDeleteModalOn} handleDeleteClick={handleDeletePost}/>
            <ReportPostModal state={reportModalOn} setState={setReportModalOn} handleDeleteClick={handleReportPost}/>
            <ScrollView>
                <ImageSwiper imageModels={postModel.imageModels} />
                <View style={styles.contentArea}>
                    <Box style={styles.titleBox}>
                        <Text style={styles.titleText}>{postModel.title}</Text>
                    </Box>
                    <Flex w="100%" h="30px" mb="50px" direction="row" alignItems="center">
                        <Text style={styles.userNameText}>{`@${owner?.username}`}</Text>
                        <Text style={{color:'gray'}}>1 day ago</Text>
                    </Flex>
                    <Text style={styles.contentText}>{postModel.info}</Text>
                </View>
            </ScrollView>
            <View style={styles.footerArea}>
                <Flex direction="row" alignItems='center'>
                    <Text flex="1" style={styles.priceText}>
                        ${postModel.price.toLocaleString()}
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
