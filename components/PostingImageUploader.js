import React from "react";
import {Box, Divider, Flex} from "native-base";
import {StyleSheet, TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {LOG, windowWidth} from "../utils/utils";
import theme from "../utils/theme";
import ImageModel from "../models/ImageModel";
import {PostImage} from "../types/PostCollection";


const MAX_IMAGE_UPLOAD_COUNT = 4;

/**
 * @param {{
 *   postImages: PostImage[];
 *   setPostImages: React.Dispatch<React.SetStateAction<PostImage[]>>;
 * }} props
 */
export default function PostingImageUploader ({postImages, setPostImages}) {
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

    async function asyncGetImageFromUserLibrary() {
        if (postImages.length >= MAX_IMAGE_UPLOAD_COUNT) return;

        if (!status?.granted) {
            const permission = await requestPermission();
            if (!permission.granted) {
                return null;
            }
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1]
        });

        if (result.canceled) return;

        const pickedImage = result.assets[0];
        console.log('filesize', pickedImage.fileSize)

        const lowImage = await ImageManipulator.manipulateAsync(
            pickedImage.uri,
            [{ resize: { width: 100, height: 100 } }],
            {}
        );

        const midImage = await ImageManipulator.manipulateAsync(
            pickedImage.uri,
            [{ resize: { width: 1024, height: 1024 } }],
            {}
        )


        let /** @type PostImage */ newPostImage = {
            downloadUrlLow: lowImage,
            downloadUrlMid: midImage,
            storageUrlLow: "",
            storageUrlMid: "",
        }

        setPostImages(prev => ([...prev, newPostImage]))
    }

    function handleRemoveImage(postImage) {
        if (!postImage) { LOG(this, "ERR::Invalid index"); return; }

        setPostImages(postImages.filter((_postImage) => _postImage.downloadUrlLow !== postImage.downloadUrlLow))
    }

    return (
        <Flex direction="row" w="100%" h="100px" style={styles.flexCenter}>
            <Box style={{margin: windowWidth * 0.05}}>
                <TouchableOpacity
                    onPress={asyncGetImageFromUserLibrary}
                    style={styles.button}
                >
                    <MaterialCommunityIcons name="camera-outline" color={theme.colors.iconGray} size={35}/>
                    <GrayText>{postImages.length + "/" + MAX_IMAGE_UPLOAD_COUNT}</GrayText>
                </TouchableOpacity>
            </Box>
            <ContentGroupBox>
                {
                    postImages.map((postImage) => (
                        <Box key={postImage.downloadUrlLow} styles={{padding:10}}>
                            <UploadImageBox>
                                <UploadImage source={{uri: postImage.downloadUrlLow}}/>
                            </UploadImageBox>
                            <TouchableOpacity
                                style={styles.imageBox}
                                onPress={() => handleRemoveImage(postImage)}
                            >
                                <Icon name="close-circle" size={20} color="#242424"/>
                            </TouchableOpacity>
                        </Box>
                    ))
                }
            </ContentGroupBox>
        </Flex>
    )
}
const styles = StyleSheet.create({
    flexCenter: {justifyContent: 'center', alignItems: 'center'},
    button: {
        width: windowWidth * 0.2,
        height: windowWidth * 0.2,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.iconGray,
    },
    lottie: {
        width: 200,
        height: 200,
    },

    imageBox: {position: 'absolute', top:-7, left:-7}
})

const UploadImageBox = styled.View`
  overflow: hidden;
  margin: 5px;
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

const ContentGroupBox = styled.View`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: start;
`
