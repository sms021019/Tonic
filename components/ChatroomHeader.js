import React, {useContext, useEffect, useState} from "react";
import GlobalContext from "../context/Context";
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
    Avatar
} from "native-base";
import {DBCollectionType, windowWidth} from "../utils/utils";
import theme from '../utils/theme'

import {TouchableOpacity, View} from "react-native";
import TimeHelper from "../helpers/TimeHelper";
import DBHelper from "../helpers/DBHelper";
import UserModel from "../models/UserModel";
import ProfileImageHelper from "../helpers/ProfileImageHelper";
import { useRecoilValue } from "recoil";

import { chatroomHeaderAtom, getOpponentUserData } from "../recoil/chatroomHeaderState";
import { userAtom } from "../recoil/userState";
import ChatroomHeaderController from "../typeControllers/ChatroomHeaderController";
import { recentTextState } from "../recoil/recentTextState";


export default function ChatroomHeader({id, onClickHandler}) {

    const user = useRecoilValue(userAtom);
    let propsForChatroomHeaderAtom = {
        id: id,
        email: user.email,
    }
    const chatroomHeader = useRecoilValue(chatroomHeaderAtom(propsForChatroomHeaderAtom));
    const opponentUserData = useRecoilValue(getOpponentUserData(chatroomHeader.opponentEmail));
    const recentText = useRecoilValue(recentTextState(chatroomHeader.chatroomId));

    function handlePostClick() {
        onClickHandler(chatroomHeader.chatroomId);
    }


    return (
        <Box>
            <TouchableOpacity onPress={handlePostClick}>
                <Box borderBottomWidth="1" _dark={{
                        borderColor: "muted.50"
                    }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2" m='2'>
                        <HStack space={[2, 3]} justifyContent="space-between">
                            <Avatar size="48px" source={ProfileImageHelper.getProfileImageUrl(opponentUserData.profileImageType)} />
                            <VStack>
                                <Text _dark={{
                                    color: "warmGray.50"
                                }} color="coolGray.800" bold>
                                    {opponentUserData?.username}
                                </Text>
                                <Text color="coolGray.600" _dark={{
                                    color: "warmGray.200"
                                }}>
                                    {recentText !== null ? recentText.text?.length >= 16 ? recentText?.text.substr(0,16)+"..." : recentText?.text : ''}
                                </Text>
                            </VStack>
                            <Spacer />
                            <Text fontSize="xs" _dark={{
                                color: "warmGray.50"
                            }} color="coolGray.800" alignSelf="flex-start">
                                {recentText !== null ? `${TimeHelper.getTopElapsedStringUntilNow(recentText.createdAt?.toDate())} ago` : ``}
                            </Text>
                        </HStack>
                    </Box>
            </TouchableOpacity>
        </Box>
    );
}