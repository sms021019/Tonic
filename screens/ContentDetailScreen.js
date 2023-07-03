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
import {collection, doc, getDoc} from 'firebase/firestore';
// Context
import GlobalContext from '../context/Context';
// Utils
import {DBCollectionType, NavigatorType, PageMode, ScreenType, windowWidth} from "../utils/utils";
import theme from '../utils/theme';
// Component
import { CreateChatroom } from './Channel';
import GoBackButton from "../components/GoBackButton";
import MenuButton from '../components/MenuButton'
import Modal from '../utils/modal'

export default function ({navigation, postModel}) {
    const [owner, setPostOwner] = useState(null);
    const [deleteModalOn, setDeleteModalOn] = useState(false);
    const uriWraps = postModel.imageDownloadUrls;
    const title = postModel.title;
    const price = postModel.price;
    const info = postModel.info;
    const email = postModel.email;
    const { user } = useContext(GlobalContext);

    useEffect(() => {
        let userRef = doc(collection(db, DBCollectionType.USERS), email);

        getDoc(userRef).then((doc) => {
            if(doc.data() === null) {
                // To Do : error handling.
                console.log(" err no post user");
                return;
            }

            setPostOwner(doc.data());
        })
    },[])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: "",
            headerLeft: () => <GoBackButton
                color={theme.colors.white}
                ml={15}
                callback={() => navigation.navigate(NavigatorType.HOME)}
            />,
            // TODO : check if the current user is the owner of the post.
            headerRight: () => (
                <MenuButton
                    mr={5}
                    size={6}
                    items={
                        isMyPost() ?
                            [
                                {name: "Edit", color: theme.colors.primary, callback: handleEditPost},
                                {name: "Delete", color: theme.colors.alert, callback: OpenDeleteModal},
                            ] :
                            [
                                {name: "Report", color: theme.colors.alert, callback: handleReportPost},
                            ]
                    }
                />
            )
        });
    }, [navigation]);

    function isMyPost() {
        return user.email === postModel.email;
    }

    function handleChatClick() {
        CreateChatroom(doc(collection(db, DBCollectionType.USERS), email), user).then((ref) => {
            navigation.navigate(NavigatorType.CHAT, { screen: ScreenType.CHAT, params: {ref: ref}, });
        });
    }

    function handleEditPost() {
        navigation.navigate(NavigatorType.POSTING, {mode: PageMode.EDIT, postModel: postModel});
    }

    function OpenDeleteModal() {
        setDeleteModalOn(true);
    }

    function handleDeletePost() {
        console.log("Delete post");

        setDeleteModalOn(false);
    }

    function handleReportPost() {

    }

    return (
        <Container>
            <Modal
                visible={deleteModalOn}
                dismiss={() => setDeleteModalOn(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.deleteModalText}>
                        Do you want to delete post?
                    </Text>
                    <Flex direction="row" style={{marginTop: 20}}>
                        <TouchableOpacity onPress={() => setDeleteModalOn(false)} style={{marginRight: 40}} >
                            <Text style={styles.tonicTextGray}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDeletePost}>
                            <Text style={styles.tonicTextBlue}>Delete</Text>
                        </TouchableOpacity>
                    </Flex>
                </View>
            </Modal>
            <ScrollView>
                <Swiper
                    height={windowWidth}
                    dot={<View style={styles.dot} />}
                    activeDot={<View style={styles.activeDot} />}
                    loop={false}
                >
                    {uriWraps.map((wrap, index) => (
                        <View key={wrap.oUri + index}>
                            <Image style={{width: windowWidth, height: windowWidth}}
                                   source={{uri: wrap.oUri}}
                            />
                            <LinearGradient
                                // Background Linear Gradient
                                colors={['rgba(0,0,0,0.1)', 'transparent']}
                                start={{ x: 0, y: 0.2}}
                                end={{x: 0, y: 0.3}}
                                style={styles.background}
                            />
                        </View>
                    ))}
                </Swiper>
                <View style={styles.contentArea}>
                    <Box w="100%" h="60px" alignItems="left" justifyContent="center">
                        <Text style={styles.titleText}>{title}</Text>
                    </Box>
                    <Flex w="100%" h="30px" mb="50px" direction="row" alignItems="center">
                        <Text style={styles.userNameText}>{`@${owner?.username}`}</Text>
                        <Text style={{color:'gray'}}>1 day ago</Text>
                    </Flex>
                    <Text style={styles.contentText}>{info}</Text>
                </View>
            </ScrollView>
            <View style={styles.footerArea}>
                <Flex direction="row" alignItems='center'>
                    <Text flex="1" style={styles.priceText}>
                        ${price.toLocaleString()}
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
    slide:                  { flex: 1, justifyContent: "center", backgroundColor: "transparent",},
    background:             { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,},
    dot:                    {backgroundColor: "rgba(255,255,255,.5)", width: 7, height: 7, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,},
    activeDot:              { backgroundColor: "#FFF", width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,},
    footerArea:             { alignSelf: 'center', height: 100, width: "100%", borderRadius: 4, padding: 10, shadowColor: 'black', shadowRadius: 8, shadowOpacity: 0.07, backgroundColor: 'white' },
    contentArea:            { display: 'flex', justifyContent:'center', width:"100%", padding:16, shadowOpacity:0.07, shadowRadius:10, shadowOffset: {width: 0, height: -15}, backgroundColor:'white' },
    priceText:              { fontSize: 24, fontWeight:'800', paddingLeft:10},
    titleText:              { fontSize: 24, fontWeight: '800'},
    userNameText:           { fontSize: 16, fontWeight: '600', marginRight:8, color:theme.colors.primary},
    contentText:            { fontSize: 20},
    bottomSheetPrimaryText: { fontSize: 22, fontWeight: '600', color:theme.colors.primary, margin:15},
    bottomSheetAlertText:   { fontSize: 22, fontWeight: '600', color:theme.colors.alert, margin:15},
    deleteModalText:        { fontSize: 16, fontWeight: '600' },
    tonicTextGray:          { fontSize: 18, fontWeight: '600', color: theme.colors.iconGray },
    tonicTextBlue:          { fontSize: 18, fontWeight: '600', color: theme.colors.primary },


    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,

        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
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

const ModalButton = styled.Pressable`
    ${TonicButton};
    display: flex;
    width: 70px;
    height: 50px;
    border-radius: 8px;
`;

const TonicText = styled.Text`
    color: ${theme.colors.white};
    font-size: 18px;
    font-weight: 600;
`;
