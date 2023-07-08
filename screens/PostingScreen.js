// React
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Button, StyleSheet, Text} from 'react-native'
// Design
import styled from "styled-components/native";
import {Divider, Flex} from "native-base";
// Firebase
import {auth} from "../firebase";
// Utils
import {LOG_ERROR, NavigatorType, PageMode, windowWidth} from "../utils/utils"
import {flexCenter} from "../utils/styleComponents";
import theme from '../utils/theme'
import ErrorScreen from "./ErrorScreen";
import AnimatedLoader from "react-native-animated-loader";
// Model
import PostModel from '../models/PostModel'
// Context
import GlobalContext from "../context/Context";
import PostingImageUploader from "../components/PostingImageUploader";
import Post from "../components/Post";

export default function PostingScreen({navigation, mode, docId}) {
    const {events} =                    useContext(GlobalContext);
    const {postModelList} =             useContext(GlobalContext);

    const [postModel, setPostModel] =   useState(null);
    // Content
    const [imageModels, setImageModels] = useState([]);
    const [title, setTitle] =           useState("");
    const [price, setPrice] =           useState(null);
    const [info, setInfo] =             useState("");
    // Page State
    const [ready, setReady] =           useState(false);
    const [loading, setLoading] =       useState(false);
    const [hasError, setHasError] =     useState(false);
    const [user, setUser] =             useState(null);

    useEffect(() => {
        if (!user)
            setUser(auth.currentUser);

        if (mode === PageMode.EDIT) {
            const postModel = postModelList.getOneByDocId(docId);
            setPostModel(postModel)
            setTitle(postModel._title)
            setPrice(postModel._price.toString())
            setInfo(postModel._info)
            setImageModels(postModel._imageModels);
        }
        if (mode === PageMode.CREATE) {
            let model = PostModel.newEmpty()
            setPostModel(model);
        }
    }, [user])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: (mode === PageMode.CREATE)? "Sell" : "Edit",
            headerRight: () => (
                <Button
                    onPress={() => setReady(true)}
                    title={(mode === PageMode.CREATE)? "Post" : "Save"}/>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        if (ready === false) return;

        if (loading === false) {
            setLoading(true);
            postModel.setTitle(title)
            postModel.setPrice(price)
            postModel.setInfo(info)
            savePost();
        }
    }, [ready]);


    if (postModel === null) {
        return (<Text>Loading...</Text>);
    }


/* -----------------------------------
     Event Handlers (Post to DB)
 ------------------------------------*/
    function savePost() {
        if (postModel.isContentReady() === false) {
            alert('Please fill everything.');
            setReady(false);
            setLoading(false);
            return;
        }

        asyncSavePost().then(() => {
            // setReady(false)
            // setLoading(false)
        });
    }

    async function asyncSavePost() {
        postModel.setEmail(user?.email);
        if (await postModel.tSavePost(imageModels) === false) {
            setHasError(true);
            return LOG_ERROR("Unknown error occur while posting the images.");
        }

        events.invokeOnContentUpdate();
        navigation.navigate(NavigatorType.HOME);
    }


/* ------------------
     Error Screen
 -------------------*/
    if (hasError) return <ErrorScreen/>

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
                <Text>{(mode === PageMode.CREATE)? "Uploading..." : "Updating..."}</Text>
            </AnimatedLoader>
            <Flex direction="column" style={styles.content}>
                <PostingImageUploader imageModels={imageModels} setImageModels={setImageModels} postModel={postModel}/>
                <Divider/>
                <TitleInputField placeholder="Title" value={title} onChangeText={setTitle}/>
                <Divider/>
                <Flex direction="row" alignItems="center" justifyContent="left">
                    <SignText style={{color: (!price)? "#bbbbbb" : "black"}}>$</SignText>
                    <PriceInputField placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric"/>
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