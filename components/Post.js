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

export default function Post(props) {

    if (props.data === null) {
        return (
            <Box></Box>
        )
    }

    const data = props.data;
    const title = data.title;
    const price = data.price;
    const uriWraps = data.imageDownloadUrls;
    const bannerImageUrl = uriWraps[0].sUri;

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
                                    <Text color="coolGray.800" fontWeight="medium" fontSize="lg">
                                        {title}
                                    </Text>
                                    <Text flex="1" mt="2" fontSize="xl" fontWeight="bold" color="coolGray.700">
                                        ${price}
                                    </Text>
                                    <Text flex="0.5" fontSize="sm" color="coolGray.800">
                                        1d
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