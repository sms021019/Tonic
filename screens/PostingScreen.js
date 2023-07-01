// React
import React, {useEffect, useLayoutEffect, useState} from 'react'
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
import {addDoc, collection, doc, updateDoc} from 'firebase/firestore';
import {auth, db, getDownloadURL, ref, storage, uploadBytesResumable} from "../firebase";
// Utils
import {createURL, DBCollectionType, LOG, LOG_ERROR, NavigatorType, PageMode, StorageDirectoryType, windowWidth} from "../utils/utils"
import {flexCenter} from "../utils/styleComponents";
import theme from '../utils/theme'
import ErrorScreen from "./ErrorScreen";
import AnimatedLoader from "react-native-animated-loader";
// Model
import PostModel from '../models/PostModel'


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

export default function PostingScreen({navigation, mode, postData}) {
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    const [title, setTitle] =       useState('');
    const [price, setPrice] =       useState('');
    const [info, setInfo] =         useState('');
    const [UriWraps, setUriWraps] = useState([]);
    const [posting, setPosting] =   useState(false);
    const [loading, setLoading] =   useState(false);
    const [hasError, setHasError] = useState(false);
    const [user, setUser] =         useState(null);

    mode = mode? mode : PageMode.CREATE;

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
            if (postData === null) {
                setHasError(true);
                return;
            }

            setTitle(postData.title);
            setPrice(postData.price);
            setInfo(postData.info);
            setUriWraps(postData.imageDownloadUrls);
        }
    }, [])


/* ----------------------------------
     Event Handlers (ImagePicker)
 ------------------------------------*/
    // Get selected image from user's library (ImagePicker)
    async function asyncGetImageFromUserLibrary() {
        if (UriWraps.length >= MAX_IMAGE_UPLOAD_COUNT) return;

        if (!status?.granted) {
            const permission = await requestPermission();
            if (!permission.granted) {
                return null;
            }
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            maxWidth: 512,
            maxHeight: 512,
            aspect: [1, 1]
        });

        if (result?.assets[0] === null) return;

        const originalImage = result.assets[0];

        const resizedImage = await ImageManipulator.manipulateAsync(
            originalImage.uri,
            [{ resize: { width: 100, height: 100 } }],
            {}
        );

        console.log(resizedImage.uri);

        let uriWrap = new UriWrap(URIType.TEMP, originalImage.uri, resizedImage.uri)

        setUriWraps((prev) => ([...prev, uriWrap]));
    }

    // Remove user's selected image
    function handleDeleteImageButtonClick(index) {
        if (index < 0 || index >= UriWraps.length) { LOG(this, "ERR::Invalid index"); return; }

        let newImageUrls = UriWraps;
        newImageUrls.splice(index, 1);
        setUriWraps(() => ([...newImageUrls]));
    }

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

            if (mode === PageMode.CREATE)
                createPostToDB(downloadUriWraps);
            else
                updatePostToDB(downloadUriWraps);
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

    async function createPostToDB(downloadUriWraps) {
        let uris = toPostUriListFormat(downloadUriWraps);

        const postModel = new PostModel(uris, title, price, info, user?.email);
        if (await postModel.saveData() === false) {
            setHasError(true);
            return;
        }

        navigation.navigate(NavigatorType.HOME);
    }

    async function updatePostToDB(downloadUriWraps) {
        let uris = toPostUriListFormat(downloadUriWraps);
        const postRef = doc(db, DBCollectionType.POSTS, postData.docId);

        let postModel = new PostModel(uris, title, price, info, user?.email);
        postModel.setRef(postRef);

        if (await postModel.updateData() === false) {
            setHasError(true);
            return;
        }

        navigation.navigate(NavigatorType.HOME);
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

    function toUserRefFormat(user) {
        return `users/${user?.email}`
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


/* ------------------
      Components
 -------------------*/
    const UploadedImages = getUploadedImagesComp();

    function getUploadedImagesComp() {
        let component = [];

        for (let i = 0; i < MAX_IMAGE_UPLOAD_COUNT; i++) {
            if (UriWraps[i]) {
                component.push(
                    <Box key={i}>
                        <UploadImageBox>
                            <UploadImage source={{uri: UriWraps[i].sUri}}/>
                        </UploadImageBox>
                        <TouchableOpacity
                            style={{position: 'absolute', left: 40, top: -5}}
                            onPress={() => handleDeleteImageButtonClick(i)}
                        >
                            <Icon name="close-circle" size={20} color="#242424"/>
                        </TouchableOpacity>
                    </Box>
                )
            } else {
                component.push(<UploadImageBox key={i}><GrayText>{i + 1}</GrayText></UploadImageBox>);
            }
        }
        return component
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
                <Text>{(mode === PageMode.CREATE)? "Uploading..." : "Updating..."}</Text>
            </AnimatedLoader>
            <Flex direction="column" style={{height: "100%", width: "100%"}}>
                <Flex direction="row" w="100%" h="100px" style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Box style={{margin: windowWidth * 0.05}}>
                        <TouchableOpacity
                            onPress={asyncGetImageFromUserLibrary}
                            style={[styles.button, styles.buttonOutline]}
                        >
                            <MaterialCommunityIcons name="camera-outline" color={theme.colors.iconGray} size={35}/>
                            <GrayText>{UriWraps.length + "/" + MAX_IMAGE_UPLOAD_COUNT}</GrayText>
                        </TouchableOpacity>
                    </Box>
                    <Divider orientation="vertical" height="80%"/>
                    <ContentGroupBox>
                        {UploadedImages}
                    </ContentGroupBox>
                </Flex>
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

const UploadImageBox = styled.View`
  overflow: hidden;
  width: ${windowWidth * 0.14}px;
  height: ${windowWidth * 0.14}px;
  border-width: 1px;
  border-color: ${theme.colors.iconGray};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

const UploadImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 10px;
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