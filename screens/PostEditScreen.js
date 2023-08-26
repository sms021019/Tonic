// React
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Button, StyleSheet, Text, View} from 'react-native'
// Design
import styled from "styled-components/native";
import {Divider, Flex} from "native-base";
// Utils
import {LOG_ERROR, NavigatorType, PageMode, windowWidth} from "../utils/utils"
import {flexCenter} from "../utils/styleComponents";
import theme from '../utils/theme'
import ErrorScreen from "./ErrorScreen";
import AnimatedLoader from "react-native-animated-loader";
// Context
import GlobalContext from "../context/Context";
import PostingImageUploader from "../components/PostingImageUploader";
import {PostCollect, PostCollection} from '../types/PostCollection'
import TimeHelper from "../helpers/TimeHelper";
import PostController from "../typeControllers/PostController";
// Recoil
import {postAtom} from "../recoli/postState";
import {useRecoilState} from "recoil";


export default function PostEditScreen({navigation, postId}) {
    const {events} = useContext(GlobalContext);

    const [post, setPost] = useRecoilState(postAtom(postId));

    const [title, setTitle] =           useState("");
    const [price, setPrice] =           useState(0);
    const [info, setInfo] =             useState("");

    const [postImages, setPostImages] = useState(/** @type {PostImage[]} */ []);

    // Page Status
    const [ready, setReady] =           useState(false);
    const [loading, setLoading] =       useState(false);
    const [hasError, setHasError] =     useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Edit",
            headerRight: () => (
                <Button
                    onPress={() => setReady(true)}
                    title="Save"/>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        if (post) {
            setTitle(post.title)
            setPrice(post.price)
            setInfo(post.info)
            setPostImages(post.postImages)
        }
    }, [post])

    useEffect(() => {
        if (ready === false) return;

        if (loading === false) {
            setLoading(true);
            trySavePost();
        }
    }, [ready]);

/* -----------------------------------
     Event Handlers (Post to DB)
 ------------------------------------*/
    function trySavePost() {
        if (title === "" || price <= 0 || info === "") {
            alert('Please fill everything.');
            setReady(false);
            setLoading(false);
            return false;
        }

        asyncSavePost().then();
    }

    async function asyncSavePost() {

        let /** @type PostDoc */ newPost = {
            docId: post.docId,
            ownerEmail: post.ownerEmail,
            title,
            price,
            info,
            postTime: post.postTime,
            postImages
        }

        if (await PostController.asyncUpdate(post, newPost) === false) {
            setHasError(true);
            return LOG_ERROR("Unknown error occur while posting the images.");
        }

        setPost(newPost);

        events.invokeOnContentUpdate();
        navigation.navigate(NavigatorType.HOME);
    }

/* ------------------
     Error Screen
 -------------------*/
    if (hasError) return <ErrorScreen/>

    function onPriceChange(priceString) {
        setPrice(Number(priceString.replace(/,/g, '')));
    }
/* -------------
     Render
 ---------------*/
    return (
        <Container>
            <AnimatedLoader
                visible={loading}
                overlayColor="rgba(255,255,255,0.75)"
                animationStyle={styles.lottie}
                source={require("../assets/hand-loading.json")}
                speed={1}
            >
                <Text>Uploading...</Text>
            </AnimatedLoader>
            <Flex direction="column" style={styles.content}>
                <PostingImageUploader postImages={postImages} setPostImages={setPostImages}/>
                <Divider/>
                <TitleInputField placeholder="Title" value={title} onChangeText={setTitle}/>
                <Divider/>
                <Flex direction="row" alignItems="center" justifyContent="left">
                    <SignText style={{color: "black"}}>$</SignText>
                    <PriceInputField placeholder="Price" value={price.toLocaleString()} onChangeText={onPriceChange} keyboardType="numeric"/>
                </Flex>
                <Divider/>
                <InfoInputField placeholder="Explain your product." flex="1" multiline={true} value={info} onChangeText={setInfo} />
            </Flex>
        </Container>
    )
}

/* ---------------
     Styles
 ----------------*/
const styles = StyleSheet.create({
    button: {
        width: windowWidth * 0.2,
        height: windowWidth * 0.2,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: theme.colors.iconGray,
    },
    lottie: {
        width: 200,
        height: 200,
    },
    content: {height: "100%", width: "100%"}
})

const Container = styled.View`
  ${flexCenter};
  background-color: #fff;
`;

const TitleInputField = styled.TextInput`
  width: ${windowWidth}px;
  height: 60px;
  margin-left: 20px;
  font-size: 18px;
`

const PriceInputField = styled.TextInput`
  width: ${windowWidth}px;
  height: 60px;
  margin-left: 5px;
  font-size: 18px;
`

const SignText = styled.Text`
  color: #bbbbbb;
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px;
`

const InfoInputField = styled.TextInput`
  width: ${windowWidth}px;
  height: 60px;
  margin-left: 20px;
  margin-top: 20px;
  font-size: 18px;
`
