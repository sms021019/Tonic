import React from "react";
import {Box, Flex, Center, Image, Text, Divider} from "native-base";
import {windowWidth} from "../utils/utils";
import theme from '../utils/theme'
import {useRecoilValue} from "recoil";
import {postAtom} from "../recoil/postState";
import {TouchableOpacity, View} from "react-native";
import TimeHelper from "../helpers/TimeHelper";
import {thisUser} from "../recoil/userState";
import UserController from "../typeControllers/UserController";

/**
 *
 * @param {string} id
 * @param {function} onClickHandler
 * @param {bool} showBlockedOnly
 * @returns {JSX.Element}
 * @constructor
 */
export default function Post({id, onClickHandler, filterBlockedPost}) {
    const /**@type {UserDoc} */ user = useRecoilValue(thisUser);
    const /**@type {PostDoc} */ post = useRecoilValue(postAtom(id));

    console.log(user);
    const bannerImageUrl = post.postImages[0].downloadUrlLow;
    const elapsedTime = TimeHelper.getTopElapsedStringUntilNow(post.postTime);

    filterBlockedPost = filterBlockedPost ?? true;

    function handlePostClick() {
        onClickHandler();
    }


    if (filterBlockedPost === true && UserController.isPostBlockedByUser(user, post)) {
        return <></>
    }

    return (
        <View>
            <View style={{margin: 20}}>
                <TouchableOpacity onPress={handlePostClick}>
                    <Box h="100px" w={windowWidth - 40}>
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
                                    {post.title}
                                </Text>
                                <Text flex="1" mt="2" fontSize="xl" fontWeight="bold" color="coolGray.700" numberOfLines={1}>
                                    ${post.price}
                                </Text>
                                <Text flex="0.5" fontSize="sm" color="coolGray.800" numberOfLines={1}>
                                    {elapsedTime} ago
                                </Text>
                            </Flex>
                        </Flex>
                    </Box>
                </TouchableOpacity>
            </View>
            <Divider/>
        </View>
    );
}
