import React, {useContext, useEffect, useLayoutEffect, useState} from "react";
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
import {windowWidth} from "../utils/utils";
import theme from '../utils/theme'
import {TouchableOpacity, View} from "react-native";
import ChatroomModel from "../models/ChatroomModel";
import TimeHelper from "../helpers/TimeHelper";
import { setHours } from "date-fns";

export default function Chat(props) {
    const { user } = useContext(GlobalContext);
    const [recentText, setRecentText] = useState(null);
    const [timestamp, setTimestamp] = useState();
    const [opponentUsername, setOpponentUsername] = useState();

    if (props.model === null) {
        return (
            <View> no model data </View>
        )
    }

    const postModel = props.model;
    const opponent = postModel.participants[0] === user?.email ? postModel.participants[1] : postModel.participants[0];

    useEffect(() => {
        if( ChatroomModel.getRecentText(postModel.ref, setRecentText, setTimestamp) === false){
            //TO DO
            setHasError(true);
            return;
        }            

        if( ChatroomModel.asyncGetDisplayName(opponent, setOpponentUsername) === false){
            // TO DO
            setHasError(true);
            return;
        }
    },[])


    function handlePostClick() {
        props.onClickHandler();
    }

    return (
        <Box>
            <TouchableOpacity onPress={handlePostClick}>
                <Box borderBottomWidth="1" _dark={{
                        borderColor: "muted.50"
                    }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2" m='2'>
                        <HStack space={[2, 3]} justifyContent="space-between">
                            <Avatar size="48px" source={{
                                uri: null/* image URL*/
                            }} />
                            <VStack>
                                <Text _dark={{
                                    color: "warmGray.50"
                                }} color="coolGray.800" bold>
                                    {opponentUsername}
                                </Text>
                                <Text color="coolGray.600" _dark={{
                                    color: "warmGray.200"
                                }}>
                                    {recentText}
                                </Text>
                            </VStack>
                            <Spacer />
                            <Text fontSize="xs" _dark={{
                                color: "warmGray.50"
                            }} color="coolGray.800" alignSelf="flex-start">
                                {TimeHelper.getTopElapsedStringUntilNow(timestamp?.toDate())}
                            </Text>
                        </HStack>
                    </Box>
            </TouchableOpacity>
        </Box>
    );
}