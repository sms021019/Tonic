import React from "react";
import {Pressable, Text, Box, HStack, Spacer, Flex, Badge, Center, NativeBaseProvider, VStack, Image} from "native-base";
import styled from "styled-components/native";
import {flexCenter} from "../utils/styleComponents";
import {POST_SIZE, windowWidth} from "../utils/utils";

export default function Post(props) {
    function handlePostClick() {
        props.onClickHandler();
    }

    return (
        <Box>
            <Pressable onPress={handlePostClick}>
                {({isHovered, isPressed}) => {
                    return (
                        <Box h="100px" w={windowWidth - 20} bg={isPressed ? "coolGray.100" : isHovered ? "coolGray.100" : "white"} rounded="md">
                            <Flex direction="row">
                                <Center w="100px" h="100px">
                                    <Image
                                        source={{ uri: "https://wallpaperaccess.com/full/317501.jpg" }}
                                        alt="Alternate Text"
                                        borderRadius={5}
                                        size="100%" />
                                </Center>
                                <Flex flex="1" marginLeft="2">
                                    <Text color="coolGray.800" fontWeight="medium" fontSize="lg">
                                        SWISS WINGER 텀블러 SWISS
                                    </Text>
                                    <Text flex="1" mt="2" fontSize="xl" fontWeight="bold"  color="coolGray.700">
                                        $15
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