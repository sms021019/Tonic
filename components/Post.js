import React from "react";
import {
    Pressable,
    Text,
    Box,
    HStack,
    Spacer,
    Flex,
    Badge,
    Center,
    NativeBaseProvider,
    VStack,
    Image,
    Divider,
} from "native-base";
import {windowWidth} from "../utils/utils";
import theme from '../utils/theme'
import {View} from "react-native";

export default function Post(props) {

    if (props.model === null) {
        return (
            <View> no model data </View>
        )
    }

    const postModel = props.model;
    const title = postModel.title;
    const price = postModel.price;
    const bannerImageUrl = postModel.imageModels[0].sDownloadUrl;
    const elapsedTime = postModel.getElapsedString();

    function handlePostClick() {
        props.onClickHandler();
    }

    return (
        <Box>
            <Pressable onPress={handlePostClick}>
                {({isHovered, isPressed}) => {
                    return (
                        <Box h="100px" w={windowWidth - 40}
                             bg={isPressed ? "coolGray.100" : isHovered ? "coolGray.100" : "white"} rounded="md">
                            <Flex direction="row">
                                <Center w={windowWidth*0.25} h={windowWidth*0.25} borderWidth={1} borderRadius={5} borderColor={theme.colors.lightGray}>
                                    <Image
                                        source={{uri: bannerImageUrl}}
                                        alt="Alternate Text"
                                        borderRadius={5}
                                        size="100%"/>
                                </Center>
                                <Flex flex="1" marginLeft="5">
                                    <Text color="coolGray.800" fontWeight="medium" fontSize="lg" numberOfLines={1}>
                                        {title}
                                    </Text>
                                    <Text flex="1" mt="2" fontSize="xl" fontWeight="bold" color="coolGray.700" numberOfLines={1}>
                                        ${price}
                                    </Text>
                                    <Text flex="0.5" fontSize="sm" color="coolGray.800" numberOfLines={1}>
                                        {elapsedTime} ago
                                    </Text>
                                </Flex>
                            </Flex>
                        </Box>
                    )
                }}
            </Pressable>
        </Box>
    );
}