import React from "react";
import {Text, Box, HStack, Spacer, VStack, Avatar} from "native-base";
import {TouchableOpacity, View} from "react-native";
import TimeHelper from "../helpers/TimeHelper";
import ProfileImageHelper from "../helpers/ProfileImageHelper";
import { useRecoilValue } from "recoil";
import { chatroomHeaderAtom, getOpponentUserData } from "../recoil/chatroomHeaderState";
import { thisUser } from "../recoil/userState";
import { recentTextState } from "../recoil/recentTextState";


export default function ChatroomHeader({id, onClickHandler}) {

    const user = useRecoilValue(thisUser);
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
                <Box pl={["0", "4"]} pr={["0", "5"]} py="2" m='2'>
                        <HStack space={[2, 3]} justifyContent="space-between">
                            <Avatar size="48px" source={ProfileImageHelper.getProfileImageUrl(opponentUserData.profileImageType)} />
                            <VStack>
                                <Text _dark={{ color: "warmGray.50" }} color="coolGray.800" bold>
                                    {opponentUserData?.username}
                                </Text>
                                <Text color="coolGray.600" _dark={{ color: "warmGray.200" }}>
                                    {recentText !== null ? recentText.text?.length >= 16 ? recentText?.text.substr(0,16)+"..." : recentText?.text : ''}
                                </Text>
                            </VStack>
                            <Spacer />
                            <Text fontSize="xs" _dark={{ color: "warmGray.50" }} color="coolGray.800" alignSelf="flex-start">
                                {recentText !== null ? `${TimeHelper.getTopElapsedStringUntilNow(recentText.createdAt?.toDate())} ago` : ``}
                            </Text>
                        </HStack>
                </Box>
            </TouchableOpacity>
        </Box>
    );
}
