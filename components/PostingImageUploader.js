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


const MAX_IMAGE_UPLOAD_COUNT = 4;

export default function PostingImageUploader ({imageModels, setImageModels}) {
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

    async function asyncGetImageFromUserLibrary() {
        if (imageModels.length >= MAX_IMAGE_UPLOAD_COUNT) return;

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

        const smallImage = await ImageManipulator.manipulateAsync(
            originalImage.uri,
            [{ resize: { width: 100, height: 100 } }],
            {}
        );

        let model = ImageModel.newModel(originalImage.uri, smallImage.uri);
        setImageModels(prev => ([...prev, model]))
    }


    const UploadedImages = getUploadedImagesComp();

    function getUploadedImagesComp() {
        let component = [];

        for (let i = 0; i < MAX_IMAGE_UPLOAD_COUNT; i++) {
            if (imageModels[i]) {
                component.push(
                    <Box key={i}>
                        <UploadImageBox>
                            <UploadImage source={{uri: imageModels[i]._sDownloadUrl}}/>
                        </UploadImageBox>
                        <TouchableOpacity
                            style={styles.imageBox}
                            onPress={() => handleDeleteImage(i)}
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

    function handleDeleteImage(index) {
        if (index < 0 || index >= imageModels.length) { LOG(this, "ERR::Invalid index"); return; }

        let tImageModels = imageModels;
        tImageModels.splice(index, 1);
        setImageModels(() => ([...tImageModels]));
    }


    return (
        <Flex direction="row" w="100%" h="100px" style={styles.flexCenter}>
            <Box style={{margin: windowWidth * 0.05}}>
                <TouchableOpacity
                    onPress={asyncGetImageFromUserLibrary}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <MaterialCommunityIcons name="camera-outline" color={theme.colors.iconGray} size={35}/>
                    <GrayText>{imageModels.length + "/" + MAX_IMAGE_UPLOAD_COUNT}</GrayText>
                </TouchableOpacity>
            </Box>
            <Divider orientation="vertical" height="80%"/>
            <ContentGroupBox>
                {UploadedImages}
            </ContentGroupBox>
        </Flex>
    )
}
const styles = StyleSheet.create({
    flexCenter: {justifyContent: 'center', alignItems: 'center'},
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

    imageBox: {position: 'absolute', left: 40, top: -5}
})

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

const ContentGroupBox = styled.View`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-evenly;
`
