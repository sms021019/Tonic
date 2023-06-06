import React, {useEffect, useLayoutEffect, useState} from 'react'
import {View, Text, TouchableOpacity, Image, StyleSheet, Button} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from "styled-components/native";
import {flexCenter, TonicButton} from "../utils/styleComponents";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {Box, Center, Divider, Flex, Input, Pressable} from "native-base";
import * as ImagePicker from 'expo-image-picker';
import theme from '../utils/theme'
import {DBCollectionType, NavigatorType, windowWidth} from "../utils/utils"
import {addDoc, collection, getDocs} from 'firebase/firestore';
import {db, storage, ref, uploadBytes, getDownloadURL, uploadBytesResumable} from "../firebase";

const MAX_IMAGE_UPLOAD_COUNT = 4;

export default function PostingScreen({navigation, label}) {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [info, setInfo] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    const [posting, setPosting] = useState(false);

    const PostButton = <Button onPress={() => setPosting(true)} title="Post"/>;
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                PostButton
            ),
        });
    }, [navigation]);

    useEffect(() => {
        // Check if saving to avoid calling submit on screen unmounting
        if (posting) {
            asyncHandlePostClick()
        }
    }, [posting]);

    /* ------------------
          Components
     -------------------*/

    const UploadedImages = getUploadedImagesComp();

    function getUploadedImagesComp() {
        let component = [];

        for (let i = 0; i < MAX_IMAGE_UPLOAD_COUNT; i++) {
            if (imageUrls[i]) {
                component.push(
                    <Box key={i}>
                        <UploadImageBox>
                            <UploadImage source={{uri: imageUrls[i].uri}}/>
                        </UploadImageBox>
                        <TouchableOpacity style={{position: 'absolute', left: 40, top: -5}}
                                          onPress={() => handleDeleteImageButtonClick(i)}>
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


    /* ------------------
           Handlers
     -------------------*/
    function handleDeleteImageButtonClick(index) {
        let newImageUrls = imageUrls;
        newImageUrls.splice(index, 1);
        setImageUrls(() => ([...newImageUrls]));
    }

    async function asyncHandlePostClick() {
        let downloadUrls = [];

        for (let i = 0; i < imageUrls.length; i++) {
            console.log("forloop:", i)
            const blob = await CreateBlobByImageUri(imageUrls[i].uri);
            let storageRef = ref(storage, `/postImages/${imageUrls[i].fileName}`);

            console.log("a");
            uploadBytesResumable(storageRef, blob).then((snapshot) => { // causes crash
                console.log('Uploaded a blob or file!');
                getDownloadURL(storageRef).then((url) => {
                    downloadUrls.push(url);
                    if (downloadUrls.length === imageUrls.length) {
                        addDoc(collection(db, DBCollectionType.POSTS), {
                            title: title,
                            price: Number(price),
                            info: info,
                            imageDownloadUrls: downloadUrls,
                        }).then(() => {
                            navigation.navigate(NavigatorType.HOME);
                        });
                    }
                });
            });
        }
    }

    async function CreateBlobByImageUri(imageUri) {
        return await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function() {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', imageUri, true);
            xhr.send(null);
        });
    }

    async function asyncHandleUploadImageButtonClick() {
        if (imageUrls.length >= MAX_IMAGE_UPLOAD_COUNT) return;

        if (!status?.granted) {
            const permission = await requestPermission();
            if (!permission.granted) {
                return null;
            }
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
            aspect: [1, 1]
        });

        if (result?.assets[0]) {
            setImageUrls((prev) => ([...prev, result.assets[0]]));
        }
    }

    function handleSetPrice(value) {
        if (typeof value == 'string')
            value = value.replace(/,/g, '');

        value = Number(value);
        setPrice(value);
    }

    return (
        <Container>
            <Flex direction="column" style={{height: "100%", width: "100%"}}>
                <Flex direction="row" w="100%" h="100px" style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Box style={{margin: windowWidth * 0.05}}>
                        <TouchableOpacity
                            onPress={asyncHandleUploadImageButtonClick}
                            style={[styles.button, styles.buttonOutline]}
                        >
                            <MaterialCommunityIcons name="camera-outline" color={theme.colors.iconGray} size={35}/>
                            <GrayText>Add</GrayText>
                        </TouchableOpacity>
                    </Box>
                    <Divider orientation="vertical" height="80%"/>
                    <ContentGroupBox>
                        {UploadedImages}
                    </ContentGroupBox>
                </Flex>
                <Divider/>
                <TitleInputField placeholder="제목을 입력하세요" value={title} onChangeText={setTitle}/>
                <Divider/>
                <PriceInputField placeholder="$" value={price ? Number(price).toLocaleString() : ''}
                                 onChangeText={(value) => handleSetPrice(value)} keyboardType="numeric"/>
                <Divider/>
                <InfoInputField flex="1" multiline={true} value={info} onChangeText={setInfo}>
                </InfoInputField>
            </Flex>
        </Container>
    )
}
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
  width: ${windowWidth * 0.9}px;
  height: 60px;
  margin-left: 20px;
  font-size: 18px;
`

const PriceInputField = styled.TextInput`
  width: ${windowWidth * 0.9}px;
  height: 60px;
  margin-left: 20px;
  font-size: 18px;
`

const InfoInputField = styled.TextInput`
  width: ${windowWidth * 0.9}px;
  height: 60px;
  margin-left: 20px;
  margin-top: 20px;
  font-size: 18px;
`