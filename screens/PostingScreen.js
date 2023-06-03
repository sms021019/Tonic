import React, {useEffect, useState} from 'react'
import {View, Text, TouchableOpacity, Image, StyleSheet, Button} from 'react-native'
import styled from "styled-components/native";
import {flexCenter, TonicButton} from "../utils/styleComponents";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {Box, Center, Divider, Flex, Input, Pressable} from "native-base";
import * as ImagePicker from 'expo-image-picker';
import theme from '../utils/theme'
import {NavigatorType, windowWidth} from "../utils/utils";

export default function PostingScreen({navigation}) {

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [info, setInfo] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={() => handlePostClick()} title="Post" />
            ),
        });
    }, [navigation]);

    function handlePostClick() {
        navigation.navigate(NavigatorType.HOME);
    }

    async function uploadImage() {
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

        setImageUrl(result.assets[0].uri);
    }


    function handleProfilePicture()
    {

    }

    return (
        <Container>
            <Flex direction="column" style={{height: "100%", width:"100%"}}>
                <Flex direction="row" w="100%" h="100px" style={{justifyContent:'center', alignItems:'center'}}>
                    <Box style={{marginLeft: windowWidth*0.05}}>
                        <TouchableOpacity
                            onPress={uploadImage}
                            style={[styles.button, styles.buttonOutline]}
                        >
                            <MaterialCommunityIcons name="camera-outline" color={theme.colors.iconGray} size={35}/>
                            <GrayText>Add</GrayText>
                        </TouchableOpacity>
                    </Box>
                    <Flex flex="2" direction="row">
                        <UploadArea><GrayText>1</GrayText></UploadArea>
                        <UploadArea><GrayText>2</GrayText></UploadArea>
                        <UploadArea><GrayText>3</GrayText></UploadArea>
                        <UploadArea><GrayText>4</GrayText></UploadArea>
                    </Flex>
                </Flex>
                <Divider/>
                <TitleInputField placeholder="제목을 입력하세요" value={title} onChangeText={setTitle} />
                <Divider/>
                <PriceInputField placeholder="$" value={price} onChangeText={setPrice} keyboardType="numeric"/>
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

const UploadArea = styled.View`
    width: ${windowWidth * 0.14};
    height: ${windowWidth * 0.14};
    border-width: 1px;
    border-color: ${theme.colors.iconGray};
    border-radius: 10px;
    margin-left: 10px;
    align-items: center;
    justify-content: center;
`;

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