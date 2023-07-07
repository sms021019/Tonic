// React
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Button, StyleSheet, TouchableOpacity, Text} from 'react-native'
// Design
import styled from "styled-components/native";
import {Box, Divider, Flex} from "native-base";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// Image
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
// Firebase
import {auth, getDownloadURL, ref, storage, uploadBytesResumable} from "../firebase";
// Utils
import {createURL, LOG, LOG_ERROR, NavigatorType, PageMode, StorageDirectoryType, windowWidth} from "../utils/utils"
import {flexCenter} from "../utils/styleComponents";
import theme from '../utils/theme'
import ErrorScreen from "./ErrorScreen";
import AnimatedLoader from "react-native-animated-loader";
// Model
import PostModel from '../models/PostModel'
// Context
import GlobalContext from "../context/Context";
import PostingImageUploader from "../components/PostingImageUploader";


const MAX_IMAGE_UPLOAD_COUNT = 4;

const URIType = {
    TEMP: "temp",
    DOWNLOAD: "download",
}
class UriWrap {
    constructor(type = URIType.TEMP, oUri = "", sUri = "") {
        this.type = type;
        this.oUri = oUri;
        this.sUri = sUri;
    }
}

export default function PostingScreen({navigation, mode, docId}) {
    const {events} = useContext(GlobalContext);
    const {postModelList} = useContext(GlobalContext);
    const [postModel, setPostModel] = useState(null);
    const [posting, setPosting] =   useState(false);
    const [loading, setLoading] =   useState(false);
    const [hasError, setHasError] = useState(false);
    const [user, setUser] =         useState(null);



    useLayoutEffect(() => {
        navigation.setOptions({
            title: (mode === PageMode.CREATE)? "Sell" : "Edit",
            headerRight: () => (
                <Button
                    onPress={() => setPosting(true)}
                    title={(mode === PageMode.CREATE)? "Post" : "Save"}/>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        if (posting) {
            if (!loading) {
                setLoading(true);
                submitPost();
            }
        }
    }, [posting]);

    useEffect(() => {
        if (!user)
            setUser(auth.currentUser);

        if (mode === PageMode.EDIT) {
            if (postModel === null) {
                setHasError(true);
                return;
            }

            setTitle(postModel.title);
            setPrice(postModel.price);
            setInfo(postModel.info);
            setUriWraps(postModel.imageDownloadUrls);
        }
    }, [])


/* ----------------------------------
     Event Handlers (ImagePicker)
 ------------------------------------*/
    // Get selected image from user's library (ImagePicker)

    // Remove user's selected image
/* -----------------------------------
     Event Handlers (Post to DB)
 ------------------------------------*/
    function submitPost() {
        if (title === null || title === '' || price == null || price === '' || Number(price) === null) {
            alert('Please enter a price.');
            setPosting(false);
            setLoading(false);
            return;
        }

        asyncSubmitPost().then(() => {
            setPosting(false)
            setLoading(false)
        });
    }

    async function asyncSubmitPost() {
        let downloadUriWraps = UriWraps.map((wrap) => wrap.type === URIType.DOWNLOAD);

        try {
            for (const uriWrap of UriWraps) {
                if (uriWrap.type === URIType.DOWNLOAD) continue; // The image is already in DB.

                const oDownloadUri = await asyncUploadImageToDB(uriWrap.oUri);
                const sDownloadUri = await asyncUploadImageToDB(uriWrap.sUri);

                if (oDownloadUri && sDownloadUri)
                    downloadUriWraps.push( new UriWrap(URIType.DOWNLOAD, oDownloadUri, sDownloadUri) );
            }

            (mode === PageMode.CREATE)? createPostToDB(downloadUriWraps) : updatePostToDB(downloadUriWraps);
        }
        catch (err) {
            setHasError(true);
            return LOG_ERROR("Unknown error occur while posting the images.", err);
        }
    }

    async function asyncUploadImageToDB(uri, name) {
        const blob = await asyncCreateBlobByImageUri(uri);
        if (blob === null) return SetErrorAndSendLog("Invalid blob");

        let storageURL = createURL(StorageDirectoryType.POST_IMAGES, user.displayName, name + "_" + new Date().getTime());

        let storageRef = ref(storage, storageURL);
        if (storageRef === null) return SetErrorAndSendLog("Invalid storageRef");

        await uploadBytesResumable(storageRef, blob);

        return await getDownloadURL(storageRef);
    }

    function createPostToDB(downloadUriWraps) {
        async function asyncCreatePostToDB() {
            let uris = toPostUriListFormat(downloadUriWraps);

            const postModel = new PostModel(uris, title, price, info, user?.email);
            if (await postModel.saveData() === false) {
                setHasError(true);
            }
        }
        asyncCreatePostToDB().then(() => {
            events.invokeOnContentUpdate();
            navigation.navigate(NavigatorType.HOME);
        });
    }

    function updatePostToDB(downloadUriWraps) {
        async function asyncUpdatePostToDB() {
            let uris = toPostUriListFormat(downloadUriWraps);

            postModel.setImageDownloadUrls(uris);
            postModel.setTitle(title);
            postModel.setPrice(price);
            postModel.setInfo(info);

            if (await postModel.updateData() === false) {
                setHasError(true);
            }
        }
        asyncUpdatePostToDB().then(() => {
            events.invokeOnContentUpdate();
            navigation.navigate(NavigatorType.CONTENT_DETAIL, {postModel: postModel});
        });
    }

/* ---------------------
     Helper Functions
 -----------------------*/
    async function asyncCreateBlobByImageUri(imageUri) {
        return await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', imageUri, true);
            xhr.send(null);
        }).catch((e) => {
            setHasError(true);
            LOG_ERROR(e, "Fail to convert imageURI into Blob.");
            return null;
        });
    }

    function handleSetPrice(value) {
        if (typeof value == 'string')
            value = value.replace(/,/g, '');

        value = Number(value);
        setPrice(value);
    }


    function SetErrorAndSendLog(...messages) {
        setHasError(true);
        LOG_ERROR(messages);
        return -1;
    }

    function toPostUriListFormat(uriWraps) {
        let uris = []
        uriWraps.forEach((wrap) => {
            if (wrap.type === URIType.DOWNLOAD) {
                uris.push({
                    oUri: wrap.oUri,
                    sUri: wrap.sUri,
                })
            }
        })
        return uris;
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
            <Flex direction="column" style={{height: "100%", width: "100%"}}>
                <PostingImageUploader/>
                <Divider/>
                <TitleInputField placeholder="Title" value={title} onChangeText={setTitle}/>
                <Divider/>
                <Flex direction="row" alignItems="center" justifyContent="left">
                    <SignText style={{color: (!price)? "#bbbbbb" : "black"}}>$</SignText>
                    <PriceInputField placeholder="Price" value={price ? Number(price).toLocaleString() : ''}
                                     onChangeText={(value) => handleSetPrice(value)} keyboardType="numeric"/>
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
})

const Container = styled.View`
  ${flexCenter};
  background-color: #fff;
`;

const ContentGroupBox = styled.View`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-evenly;
`


const GrayText = styled.Text`
  color: ${theme.colors.text};
`

const TitleInputField = styled.TextInput`
  width: ${windowWidth};
  height: 60px;
  margin-left: 20px;
  font-size: 18px;
`

const PriceInputField = styled.TextInput`
  width: ${windowWidth};
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
  width: ${windowWidth};
  height: 60px;
  margin-left: 20px;
  margin-top: 20px;
  font-size: 18px;
`